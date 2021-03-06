import { noConflict } from 'handlebars'

// prevent pollution of the global namespace
noConflict()

export * from './createTemplateProcessor'
export * from './TemplateProcessorContext'
export * from './TemplateProcessorFunc'
