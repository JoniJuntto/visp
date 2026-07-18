// Re-export the native module. On web, it will be resolved to VispSrtModule.web.ts
// and on native platforms to VispSrtModule.ts
export { default } from './src/VispSrtModule';
export { default as VispSrtView } from './src/VispSrtView';
export * from './src/VispSrt.types';
