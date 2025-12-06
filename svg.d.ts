/**
 * SVG 模块类型声明
 * 
 * 允许 TypeScript 识别 .svg 文件作为 React 组件导入
 */

declare module '*.svg' {
  import React from 'react'
  const SVGComponent: React.FC<React.SVGProps<SVGSVGElement>>
  export default SVGComponent
}
