这工程涉及以下内容：
1. UML图使用的是MermaidJs画的
2. carota是一个开源基于canvas实现的编辑器的源码，供学习分析使用
3. chevrotain/参考官网的例子，实现的sql lexer和parser； 自己实现编辑器只需要lexer得到tokens即可， 不需要parser
4. components/CalcEditor 基于nearley实现的一个渲染demo， 不完整
5. components/SqlEditor 基于chevrotainjs实现的一个编辑器demo， 比较完整，未来如果使用可以基于这个sqlEditor实现一个计算公式编辑器
6. grammar/目录下是nearley实现计算公式的grammar定义
