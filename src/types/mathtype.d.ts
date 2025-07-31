  // eslint-disable-next-line @typescript-eslint/no-explicit-any


// This declaration file tells TypeScript about the module's structure
declare module '@wiris/mathtype-ckeditor5/dist/index.js' {
  const MathType: any;
  export default MathType;
}

// You can remove your previous `type MathExpression = any;` line if it's no longer needed,
// as it was part of a different error fix.