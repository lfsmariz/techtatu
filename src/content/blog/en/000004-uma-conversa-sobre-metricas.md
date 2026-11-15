---
title: 'A Conversation About Rulers in an AI World'
description: 'The dangers of measuring incorrectly or using a ruler on a coastline'
pubDate: 'Jun 06 2026'
heroImage: '../../../assets/software-develop.webp'
draft: false
locale: en
translationKey: 000004-uma-conversa-sobre-metricas
---

Measuring is a human instinct. We want to know how much we have grown, how much we produce, and what our work is worth. But using the wrong ruler can make us believe a beach coastline is many kilometers longer simply because we chose to measure every pebble. This phenomenon, known as **the coastline paradox**, teaches us something valuable: the measurement scale completely changes the result. In the corporate world, especially as AI enters the picture, we are experiencing something similar. Companies are choosing misleading rulers to measure productivity, creating distortions that can cost dearly, both in money and in team well-being.

Before discussing the right metrics, let us understand how easy it is to fall into this trap. Have you heard of **Token Maxxing**? It has become a Silicon Valley craze. The idea is simple: measure an employee’s productivity by the amount of AI tokens they consume. The more tokens, the more productive they supposedly are. But, as we will see, this ruler can be as absurd as measuring a coastline with a 1 cm ruler.

---

## The coastline paradox and crazy metrics

Imagine that you are a software engineer and your company decides that the productivity metric will be **lines of code written per day**. What happens? You start writing verbose, repetitive code full of redundancies. The system becomes harder to maintain, but the line count rises. The indicator turns green while the actual product gets worse. This is **Goodhart’s Law** in action: when a measure becomes a target, it ceases to be a good measure.

The coastline paradox illustrates this perfectly. If you measure England’s coast with a 100 km ruler, you get one value. With a 1 km ruler, you get a larger value because you can follow more inlets. With a 1 meter ruler, the value explodes. There is no single answer; it depends on the scale. Likewise, productivity metrics can be manipulated by choosing the "ruler".

Now add AI to the equation. Tools such as GitHub Copilot, Claude Code, and Codex generate tokens constantly. If the chosen ruler is "token consumption," you are measuring noise, not quality. Worse, you will encourage indiscriminate use, creating a false sense of productivity.

---

## When the bill comes due

The current situation shows that AI companies are desperate to contain losses. **Anthropic** spends US$8 to US$13.50 for every dollar of revenue, with US$5 billion in annualized recurring revenue and US$10 billion in expenses. To cut costs, it tried to restrict Claude Code to the US$100/month Max plan, but backed down after complaints — calling the change a "test." It has now started charging Enterprise customers for extra tokens. There was even a case of an account being suspended for excessive use, later considered a false positive.

**Microsoft**, in turn, moved GitHub Copilot to token-based billing starting June 1, 2026. The impact? Customers may see their monthly costs jump from US$39 to US$5,852 — an increase of up to 150 times. The measure aims to contain the company’s AI losses. Customers are complaining, and some are already considering abandoning AI agents.

**Google** joined the dance too. It lowered the price of the AI Ultra plan but imposed stricter limits on AI Pro. A credit system based on command complexity now restricts usage. Users call the change a "scam," since a single command consumed 13% of the quota. The limitations apply to other AI products as well, including five-hour usage windows.

All these changes have one thing in common: companies are redirecting the cost of heavy AI usage to customers while trying to create consumption metrics as a way to monetize it. The questions that remain are:

> Are customer metrics appropriate for these "adjustments" to the companies’ billing models? Are we using the right ruler to measure this situation?

---

## Token Maxxing: the new corporate craze

Diogo Cortiz’s column in UOL discusses "Token Maxxing" as the new Silicon Valley craze. The idea is simple: measure employees’ productivity by their AI token consumption. Companies such as Meta, OpenAI, and Nvidia already rank or encourage heavy technology use as a performance metric. The author warns that this pressure, without training or quality criteria, can create an illusion of productivity in which the goal is to look productive rather than deliver real results.

This reminds me of an analogy: if you measure a writer’s productivity by the number of words they type per day, you will not create the infinite monkey; you will most likely create a nonsense generator. Token Maxxing does the same with AI. An employee can generate thousands of tokens with useless questions, repetitive answers, or by using AI for tasks that do not need it. The number rises, but the value delivered falls.

Furthermore, this metric completely ignores output quality. A token from a precise and relevant answer is worth more than a thousand hallucinated tokens. But the ruler cannot tell the difference. It is like measuring a dish’s quality by the weight of its ingredients without tasting it.

---

## Effective and risky metrics: frameworks that can help

If token maxxing is a broken ruler, what should we use? Fortunately, established frameworks assess productivity and performance more evenly. Let us look at three major ones: **DORA**, **SPACE**, and **DevEx**. Each has strengths and weaknesses, and combining them can provide a more complete view.

### Framework DORA (DevOps Research and Assessment)

DORA measures engineering’s business impact through stability and velocity indicators. Its four main metrics are:

- **Deployment Frequency**: how often code reaches production (e.g. daily, weekly).
- **Lead Time for Changes**: the time from the initial commit to delivery in production.
- **Change Failure Rate**: the percentage of deployments that result in production problems.
- **Mean Time to Recovery (MTTR)**: the time needed to restore service after a failure.

**Strengths**: objective metrics based on system data. They allow teams to be compared and bottlenecks to be identified. Very useful for DevOps teams.

**Weaknesses**: focuses only on technical delivery, ignoring team satisfaction, collaboration, and innovation. It can encourage fast but fragile deployments if the failure rate is not balanced. It also does not consider code quality or business value.

### SPACE framework (Satisfaction, Performance, Activity, Communication, Efficiency)

SPACE measures team effectiveness and flow more broadly, including behavioral and qualitative factors. Its five components:

- **Satisfaction and Well-Being**: satisfaction, burnout, and motivation surveys about the tools.
- **Performance**: measurable results produced by the system, such as quality, impact, and adoption of new features.
- **Activity**: number of builds, volume of code reviews (pull requests), and sprint progress.
- **Communication and Collaboration**: quality of information exchange, team integration, and ease of documentation.
- **Efficiency and Flow**: the ability to focus without interruptions and speed from starting to completing tasks.

**Strengths**: covers human and technical dimensions, balancing quantitative and qualitative data. It helps detect burnout and collaboration problems.

**Weaknesses**: subjective metrics (such as satisfaction) can be difficult to compare. They require discipline to collect qualitative data regularly. It may feel like "too much to measure."

### DevEx framework (Developer Experience)

DevEx measures how technical friction affects daily work, correlating the work environment with delivery capability. Common indicators:

- **Code and Test Quality**: automated test coverage and defect density.
- **Tooling Friction**: idle time during code reviews or because of slow CI/CD pipelines.
- **Rework Rate**: percentage of tasks or features that must be redone.

**Strengths**: focuses on the developer experience, one of the strongest predictors of productivity. It helps identify improvements to the environment.

**Weaknesses**: metrics such as "friction" can be difficult to capture automatically. They may require additional instrumentation.

### Combining frameworks: the best of both worlds

None of these frameworks is sufficient on its own. DORA provides objective delivery data but ignores the human side. SPACE captures well-being and collaboration but depends on surveys. DevEx focuses on experience but may miss business impact.

The recommendation would be to use **DORA for objective data** and **SPACE to understand the human side behind the numbers**. DevEx serves as a lens for identifying tooling bottlenecks.

**Best practices**: focus on trends, not absolute targets. Evaluate the historical evolution of metrics instead of assigning individual scores. Avoid Goodhart’s Law: never use metrics for individual punishment. A metric that becomes a target stops being a good metric.

---

## Conclusion

Returning to the coastline: measuring is necessary, but the ruler matters. Using token consumption as a productivity metric is like measuring a coast with a 1 cm ruler — you get a gigantic but irrelevant number. The news about token billing, plan restrictions, and Token Maxxing culture shows that we are in a transition in which companies are trying to turn AI into a controllable cost center. But it is up to us, as professionals, not to fall into the trap of measuring what is easy instead of what matters.

The DORA, SPACE, and DevEx frameworks offer more mature paths, even though they are shortsighted when used in isolation. Combining them provides a systemic view that balances delivery, satisfaction, and efficiency. But care is required: metrics are tools, not ends. As the saying goes, "what gets measured gets managed," but also, "what is poorly measured is poorly managed."

> I admit that this is a beautiful engineering challenge: choosing rulers that capture the complexity of work without getting lost in the illusion of attractive numbers that do not reflect reality. After all, measuring a coastline precisely is **impossible**. The art lies in choosing the right scale for each question.

---

## References

<ul>
  <li><a href="https://www.uol.com.br/tilt/colunas/diogo-cortiz/2026/05/10/token-maxxing-ranquear-funcionarios-pelo-uso-de-ia-virou-febre-corporativa.htm" target="_blank">"Token Maxxing: ranking employees by AI usage became a corporate craze"</a>, UOL Tilt, 10/05/2026.</li>
  <li><a href="https://www.androidauthority.com/google-ai-pro-usage-limits-3669063/" target="_blank">"Google lowers AI Ultra price but imposes stricter limits on AI Pro"</a>, Android Authority.</li>
  <li><a href="https://manualdousuario.net/github-copilot-cobranca-tokens-ia/" target="_blank">"Microsoft will move GitHub Copilot to token-based billing starting June 1, 2026"</a>, User Manual.</li>
  <li><a href="https://manualdousuario.net/claude-code-limites-uso/" target="_blank">"Anthropic spends more than it earns and tries to cut costs with Claude Code"</a>, User Manual.</li>
</ul>
