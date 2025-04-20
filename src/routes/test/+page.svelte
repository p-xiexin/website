<!-- src/routes/+page.svelte -->
<script>
  import MarkdownRender from "$lib/components/MarkdownRender.svelte";
  import Container from '$lib/components/container/Container.svelte';
  import FloatingCatalog from '$lib/components/FloatingCatalog.svelte'

  const catalog = [
    { title: '令人骄傲的品质' },
    { title: '自立门派的玩法' },
    { title: '独属我们的西游' },
    {
      title: '总结',
      children: ['优点', '缺点', '评测成绩', '《黑神话：悟空》评测 10 分｜IGN 中国']
    }
  ]

  const mdContent = `
# Markdown与数学公式渲染示例

## Markdown基本用法

这是一个**粗体**文本，这是*斜体*文本。

### 列表示例

无序列表:
- 项目1
- 项目2
- 项目3

有序列表:
1. 第一项
2. 第二项
3. 第三项

### 代码示例

\`\`\`javascript
// function hello() {
//   console.log("Hello, world!");
// }
\`\`\`

\`\`\`cpp
int main{
  std::cout << "hello world" << std::endl;
  return 0
}
\`\`\`

## 数学公式示例

行内公式: $E = mc^2$

行间公式:

$$
\\frac{d}{dx}\\left( \\int_{a}^{x} f(u)\\,du\\right) = f(x)
$$

另一个复杂公式:

$$
\\begin{aligned}
\\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} & = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\
\\nabla \\cdot \\vec{\\mathbf{E}} & = 4 \\pi \\rho \\\\
\\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} & = \\vec{\\mathbf{0}} \\\\
\\nabla \\cdot \\vec{\\mathbf{B}} & = 0
\\end{aligned}
$$


`;
</script>

<Container className="mt-16 lg:mt-32">
    <MarkdownRender content={mdContent} />
</Container>
