declare module '*/version.json' {
  const version: string;
  const commit: string;
  const deployedAt: string;
  export { version, commit, deployedAt };
  const content: {
    version: string;
    commit: string;
    deployedAt: string;
  };
  export default content;
}
