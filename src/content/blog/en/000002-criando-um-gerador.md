---
title: 'Creating a Code Generator'
description: 'A not-so-pretty guide to code generators in Go'
pubDate: 'Nov 08 2025'
heroImage: '../../../assets/software-develop.webp'
draft: false
locale: en
translationKey: 000002-criando-um-gerador
---

How often do we run into repetitive tasks that, because they are routine and trivial, we simply *ignore*? It is curious: some developers create **_aliases_** for tiny Git commands, yet keep losing precious minutes whenever they need to create a new use case.

You know when a component always requires an implementation of a specific interface? Or when the constructor for that new component invariably needs the same validations? Or when your favorite LLM decides to "help" by changing attributes with a single tab and only gets in the way? Sometimes, simple — when done well — can save *a lot* of our time.

---

## What will we need?

- **Blunt scissors** – *optional, but you never know.*
- **fmt** – It is useful to display clear *outputs* when something fails.
- **go/format** – Our automatic Go code formatter.
- **os** – To manipulate/create the output folders for the files.
- **path/filepath** – To navigate easily among the source files.
- **strings** – To manipulate input and output text.
- **text/template** – The core of everything here. [See the docs](https://pkg.go.dev/text/template)
- **toml, env, conf** – Any library for managing configuration; I used *toml* here, but feel free to adapt it.

---

## Step by step

In the example below, I use the library to generate a set of Go files for the structures we will use in a *server-driven UI* system. The output JSON files are defined by the frontend team.


#### 1. Defining structs and loading configuration


```go

type Config struct {
	InputFolder  string `toml:"input-folder"`
	OutputFolder string `toml:"output-folder"`
}

type JSONData struct {
	UIType string                 `json:"ui_type"`
	Data   map[string]interface{} `json:"data"`
}

type Field struct {
	Name     string
	Type     string
	JSONTag  string
	IsStruct bool
	Struct   *StructDef
}

type StructDef struct {
	Name   string
	Fields []Field
}

func main() {
	configData, err := os.ReadFile("conf-frog.toml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "error reading configuration file: %v\n", err)
		os.Exit(1)
	}

	var config Config
	if err := toml.Unmarshal(configData, &config); err != nil {
		fmt.Fprintf(os.Stderr, "error parsing TOML: %v\n", err)
		os.Exit(1)
	}

	if config.InputFolder == "" {
		fmt.Fprintf(os.Stderr, "error: 'input-folder' is not specified in the configuration\n")
		os.Exit(1)
	}

	if config.OutputFolder == "" {
		fmt.Fprintf(os.Stderr, "error: 'output-folder' is not specified in the configuration\n")
		os.Exit(1)
	}

	// Create the output folder if it does not exist
	if err := os.MkdirAll(config.OutputFolder, 0755); err != nil {
		fmt.Fprintf(os.Stderr, "error creating output folder: %v\n", err)
		os.Exit(1)
	}

	// Find all JSON files in the input folder
	jsonFiles, err := filepath.Glob(filepath.Join(config.InputFolder, "*.json"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "error searching for JSON files: %v\n", err)
		os.Exit(1)
	}

	if len(jsonFiles) == 0 {
		fmt.Printf("No JSON files found in %s\n", config.InputFolder)
		return
	}

	// Process each JSON file
	for _, jsonFile := range jsonFiles {
		if err := processJSONFile(jsonFile, config.OutputFolder); err != nil {
			fmt.Fprintf(os.Stderr, "error processing %s: %v\n", jsonFile, err)
			continue
		}
		fmt.Printf("Processado: %s\n", jsonFile)
	}
}
```

#### 2. Starting the processing
A good old **loop** to go through all the files in the folder defined as *input*

```go
for _, jsonFile := range jsonFiles {
		if err := processJSONFile(jsonFile, config.OutputFolder); err != nil {
			fmt.Fprintf(os.Stderr, "error processing %s: %v\n", jsonFile, err)
			continue
		}
		fmt.Printf("Processado: %s\n", jsonFile)
	}
```

#### 3. Breaking down processJSONFile

These first steps are just manipulations I made to make generating the next stage more practical

1. Read the **JSON** file
2. **Unmarshal** it into a structure
3. Get the `.json` filename to use when **creating** the new file

```go
	// Read and parse JSON
	data, err := os.ReadFile(jsonPath)
	if err != nil {
		return fmt.Errorf("error reading file: %w", err)
	}

	var jsonData JSONData
	if err := json.Unmarshal(data, &jsonData); err != nil {
		return fmt.Errorf("error parsing JSON: %w", err)
	}

	// Get the filename without its extension
	baseName := filepath.Base(jsonPath)
	fileName := strings.TrimSuffix(baseName, ".json")

	// Generate the main struct (using the filename as a prefix for nested structs)
	mainStruct := generateStruct(jsonData.UIType, jsonData.Data, "")
```

#### 4. Manipulating

Manipulate everything necessary and possible to make file creation easier. Here I extract everything that can and must be used when creating the new **structs**.


```go
type Field struct {
	Name     string
	Type     string
	JSONTag  string
	IsStruct bool
	Struct   *StructDef
}

type StructDef struct {
	Name   string
	Fields []Field
}

```

#### 5. Reflection

This is shock therapy for anyone who avoids **reflection** at all costs. *Enjoy the vibe* and accept that this will occasionally go wrong, but everything works out in the end.

Jokes aside, we cannot avoid it: what we are doing is metaprogramming in its purest form. It is code generating code.


```go

func generateStruct(name string, data map[string]interface{}, parentPrefix string) *StructDef {
	// Struct name: if there is a parentPrefix, use parentPrefix + capitalize(name); otherwise, just capitalize(name)
	structName := capitalize(name)
	if parentPrefix != "" {
		structName = parentPrefix + structName
	}

	structDef := &StructDef{
		Name:   structName,
		Fields: []Field{},
	}

	for key, value := range data {
		field := Field{
			Name:    capitalize(key),
			JSONTag: key,
		}

		switch v := value.(type) {
		case string:
			field.Type = "string"
		case float64:
			// Check whether it is an integer
			if v == float64(int64(v)) {
				field.Type = "int"
			} else {
				field.Type = "float64"
			}
		case bool:
			field.Type = "bool"
		case []interface{}:
			// Array - check the type of the first element
			if len(v) > 0 {
				elemType := inferType(v[0])
				field.Type = "[]" + elemType
			} else {
				field.Type = "[]interface{}"
			}
		case map[string]interface{}:
			// Nested struct - use the parent type as a prefix
			field.IsStruct = true
			field.Struct = generateStruct(key, v, structName)
			field.Type = field.Struct.Name
		default:
			field.Type = "interface{}"
		}

		structDef.Fields = append(structDef.Fields, field)
	}

	return structDef
}

```

#### 6. Behind the scenes

I kept this section as direct as possible to explain the details that were not covered, but I believe the function names make their purpose clear

```go

// Uppercase so that the new structs are exported
func capitalize(s string) string {
	if s == "" {
		return s
	}
	runes := []rune(s)
	runes[0] = unicode.ToUpper(runes[0])
	return string(runes)
}

// How do we determine the type of each field in the JSON example supplied by the frontend?
func inferType(value interface{}) string {
	switch v := value.(type) {
	case string:
		return "string"
	case float64:
		if v == float64(int64(v)) {
			return "int"
		}
		return "float64"
	case bool:
		return "bool"
	case map[string]interface{}:
		return "map[string]interface{}"
	default:
		return "interface{}"
	}
}

```

#### 7. The star of the show

Here we reach the climax: the moment when the file is actually generated. Pay attention to **`collectStructs`**, which recursively ensures that objects can be nested and still produce valid code.

```go

func generateGoCode(packageName string, mainStruct *StructDef) (string, error) {
	tmpl := `// Code generated by frog; DO NOT EDIT.

package {{.Package}}

{{range .AllStructs}}
type {{.Name}} struct {
{{range .Fields}}	{{.Name}} {{.Type}} ` + "`json:\"{{.JSONTag}}\"`" + `
{{end}}}
{{end}}
`

	t, err := template.New("codegen").Parse(tmpl)
	if err != nil {
		return "", err
	}

	// Collect all structs (main + nested)
	allStructs := collectAllStructs(mainStruct)

	data := struct {
		Package    string
		AllStructs []*StructDef
	}{
		Package:    packageName,
		AllStructs: allStructs,
	}

	var buf strings.Builder
	if err := t.Execute(&buf, data); err != nil {
		return "", err
	}

	return buf.String(), nil
}

func collectAllStructs(structDef *StructDef) []*StructDef {
	var all []*StructDef

	// Add nested structs first
	for _, field := range structDef.Fields {
		if field.IsStruct && field.Struct != nil {
			all = append(all, collectAllStructs(field.Struct)...)
		}
	}

	// Add the main struct last
	all = append(all, structDef)

	return all
}

```

#### 8. Cleaning up the mess

The moment when we make the linter and reviewers happy. This is the missing part of **`processJSONFile`**

```go

// Format code
	formatted, err := format.Source([]byte(code))
	if err != nil {
		return fmt.Errorf("error formatting code: %w", err)
	}

	// Create the output filename
	outputFile := filepath.Join(outputFolder, fileName+".go")

	// Write the file
	if err := os.WriteFile(outputFile, formatted, 0644); err != nil {
		return fmt.Errorf("error writing file: %w", err)
	}

	return nil

```

## Conclusion

This is when we admire the final result and create a file like this:

#### box.json
```json
{
    "ui_type": "box",
    "data": {
        "title": "Box 1",
        "description": "This is the first box",
        "style": {
            "backgroundColor": "red",
            "color": "white",
            "size": 2.5,
            "borderRadius": 10,
            "borderDash": [10, 10]

        }
    }
}
```

becomes something like this for our **Server-Driven UI**

#### box.go

```go
// Code generated by frog; DO NOT EDIT.

package frog

type BoxStyle struct {
	Size            float64 `json:"size"`
	BorderRadius    int     `json:"borderRadius"`
	BorderDash      []int   `json:"borderDash"`
	BackgroundColor string  `json:"backgroundColor"`
	Color           string  `json:"color"`
}

type Box struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Style       BoxStyle `json:"style"`
}

```

If you want to see the complete code, just look at the LINK
