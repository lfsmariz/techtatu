---
title: 'Criando um gerador de código'
description: 'Um guia nada bonito para geradores de código com golang'
pubDate: 'Nov 08 2025'
heroImage: '../../assets/software-develop.webp'
draft: false
locale: pt-BR
translationKey: 000002-criando-um-gerador
---

Quantas vezes nos deparamos com tarefas repetitivas que, por serem corriqueiras e triviais, simplesmente *ignoramos*? É curioso, tem dev que cria **_alias_** para comandos minúsculos do Git, mas vive perdendo preciosos minutos sempre que precisa criar um novo caso de uso.

Sabe quando um componente sempre exige uma implementação de uma interface específica? Ou quando o construtor daquele novo componente precisa, invariavelmente, das mesmas validações? Ou ainda quando sua LLM favorita resolve "te ajudar" mexendo nos atributos com um simples tab e, no fim, só atrapalha? Às vezes, o simples — bem feito — pode salvar *muito* do nosso tempo.

---

## O que vamos precisar?

- **Tesoura sem ponta** – *opcional, mas nunca se sabe.*
- **fmt** – É bom exibir *outputs* claros quando algo falhar.
- **go/format** – Nosso formato automático de código Go.
- **os** – Pra manipular/criar as pastas de saída dos arquivos.
- **path/filepath** – Para navegar facilmente entre os arquivos-base.
- **strings** – Manipular o texto de entrada e saída.
- **text/template** – O core de tudo por aqui. [Veja na doc](https://pkg.go.dev/text/template)
- **toml, env, conf** – Qualquer lib para gerenciar configs; aqui usei *toml*, mas fique à vontade para adaptar.

---

## Passo a passo

No caso apresentado abaixo, uso a biblioteca para gerar um conjunto de arquivos Go referentes às estruturas que vamos usar em um sistema de *server driven UI*. Os JSONs de saída são definidos pela equipe de frontend.


#### 1. Setando Structs e Carregando as configs


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
		fmt.Fprintf(os.Stderr, "erro ao ler arquivo de configuração: %v\n", err)
		os.Exit(1)
	}

	var config Config
	if err := toml.Unmarshal(configData, &config); err != nil {
		fmt.Fprintf(os.Stderr, "erro ao fazer parse do TOML: %v\n", err)
		os.Exit(1)
	}

	if config.InputFolder == "" {
		fmt.Fprintf(os.Stderr, "erro: 'input-folder' não especificado na configuração\n")
		os.Exit(1)
	}

	if config.OutputFolder == "" {
		fmt.Fprintf(os.Stderr, "erro: 'output-folder' não especificado na configuração\n")
		os.Exit(1)
	}

	// Criar pasta de output se não existir
	if err := os.MkdirAll(config.OutputFolder, 0755); err != nil {
		fmt.Fprintf(os.Stderr, "erro ao criar pasta de output: %v\n", err)
		os.Exit(1)
	}

	// Encontrar todos os arquivos JSON na pasta de input
	jsonFiles, err := filepath.Glob(filepath.Join(config.InputFolder, "*.json"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "erro ao buscar arquivos JSON: %v\n", err)
		os.Exit(1)
	}

	if len(jsonFiles) == 0 {
		fmt.Printf("Nenhum arquivo JSON encontrado em %s\n", config.InputFolder)
		return
	}

	// Processar cada arquivo JSON
	for _, jsonFile := range jsonFiles {
		if err := processJSONFile(jsonFile, config.OutputFolder); err != nil {
			fmt.Fprintf(os.Stderr, "erro ao processar %s: %v\n", jsonFile, err)
			continue
		}
		fmt.Printf("Processado: %s\n", jsonFile)
	}
}
```

#### 2. Iniciando o processamento
Um bom e velho **loop** para percorrer todos os arquivos da pasta definida como *input*

```go
for _, jsonFile := range jsonFiles {
		if err := processJSONFile(jsonFile, config.OutputFolder); err != nil {
			fmt.Fprintf(os.Stderr, "erro ao processar %s: %v\n", jsonFile, err)
			continue
		}
		fmt.Printf("Processado: %s\n", jsonFile)
	}
```

#### 3. Destrinchando o processJSONFile

Esses primeiros passos são apenas manipulações que fiz com o intuito de tornar mais prático a geração da próxima etapa

1. Leio o arquivo **JSON**
2. Faço **unmarshal** para uma estrutura
3. Obtenho nome do arquivo `.json` para utilizar na hora da **criação** do novo arquivo

```go
	// Ler e parsear JSON
	data, err := os.ReadFile(jsonPath)
	if err != nil {
		return fmt.Errorf("erro ao ler arquivo: %w", err)
	}

	var jsonData JSONData
	if err := json.Unmarshal(data, &jsonData); err != nil {
		return fmt.Errorf("erro ao fazer parse do JSON: %w", err)
	}

	// Obter nome do arquivo sem extensão
	baseName := filepath.Base(jsonPath)
	fileName := strings.TrimSuffix(baseName, ".json")

	// Gerar struct principal (passando o nome do arquivo como prefixo para structs aninhadas)
	mainStruct := generateStruct(jsonData.UIType, jsonData.Data, "")
```

#### 4. Manipulando

Manipule tudo que for necessário e possível para facilitar no momento da criação do arquivo. Aqui eu já extraio tudo que for possível e necessário para usar na hora de criar as novas **structs**


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

#### 5. Reflect

Aqui é tratamento de choque para quem evita a todo custo o tema de **reflections**. *Curte a vibe* e aceita que vez ou outra isso vai dar errado, mas no fim dá tudo certo.

Brincadeiras à parte, não dá pra fugir disso, afinal o que estamos fazendo é metaprogramação em seu aspecto mais puro. É código gerando código.


```go

func generateStruct(name string, data map[string]interface{}, parentPrefix string) *StructDef {
	// Nome da struct: se tem parentPrefix, usa parentPrefix + capitalize(name), senão só capitalize(name)
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
			// Verificar se é inteiro
			if v == float64(int64(v)) {
				field.Type = "int"
			} else {
				field.Type = "float64"
			}
		case bool:
			field.Type = "bool"
		case []interface{}:
			// Array - verificar tipo do primeiro elemento
			if len(v) > 0 {
				elemType := inferType(v[0])
				field.Type = "[]" + elemType
			} else {
				field.Type = "[]interface{}"
			}
		case map[string]interface{}:
			// Struct aninhada - usar o prefixo do tipo pai
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

#### 6. Os bastidores

Deixei essa seção o mais direta possível apenas para entender os detalhes não explicados, mas acredito que o nome das funções são bem claros quanto ao conteúdo

```go

// Letra maiúscula para que as novas structs sejam públicas
func capitalize(s string) string {
	if s == "" {
		return s
	}
	runes := []rune(s)
	runes[0] = unicode.ToUpper(runes[0])
	return string(runes)
}

//Como descobrir os tipos de cada campo no json de exemplo deixado pelo front?
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

#### 7. A estrela do show

Aqui temos o ápice de tudo, o momento em que de fato o arquivo é gerado. Destaque para o **`collectStructs`**, responsável pela recursão que vai garantir que objetos possam ser aninhados e ainda assim gerar código válido.

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

	// Coletar todas as structs (principal + aninhadas)
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

	// Adicionar structs aninhadas primeiro
	for _, field := range structDef.Fields {
		if field.IsStruct && field.Struct != nil {
			all = append(all, collectAllStructs(field.Struct)...)
		}
	}

	// Adicionar a struct principal por último
	all = append(all, structDef)

	return all
}

```

#### 8. Arrumando a bagunça

Aquele momento que deixamos o linter e os revisores felizes. Essa é a parte que faltava do **`processJSONFile`**

```go

// Formatar código
	formatted, err := format.Source([]byte(code))
	if err != nil {
		return fmt.Errorf("erro ao formatar código: %w", err)
	}

	// Criar nome do arquivo de saída
	outputFile := filepath.Join(outputFolder, fileName+".go")

	// Escrever arquivo
	if err := os.WriteFile(outputFile, formatted, 0644); err != nil {
		return fmt.Errorf("erro ao escrever arquivo: %w", err)
	}

	return nil

```

## Conclusão

Esse é o momento em que admiramos os resultados finais e fazemos um arquivo como esse:

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

virar algo assim para nosso **Server Driven UI**

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

Para quem quiser ver o código completo, só olhar no LINK
