const fg = require('fast-glob')
const { Jsonotron } = require('jsonotron-js')
const { MarkdownGenerator } = require('jsonotron-codegen')
const { readFile, writeFile } = require('fs/promises')

async function run () {
  const enumTypeFileNames = await fg('./enumTypes/*.yaml')
  const schemaTypeFileNames = await fg('./schemaTypes/*.yaml')
  const typeFileNames = enumTypeFileNames.concat(schemaTypeFileNames)

  const types = await Promise.all(typeFileNames.map(fileName => readFile(fileName, 'utf8')))

  const jsonotron = new Jsonotron({ types })

  const systems = [
    'https://jsonotron.org/jss'
  ]

  const markdownGenerator = new MarkdownGenerator()
  const markdown = markdownGenerator.generate({
    enumTypes: jsonotron.getEnumTypes(systems),
    schemaTypes: jsonotron.getSchemaTypes(systems)
  })

  await writeFile('./typedocs.autogen.md', markdown)
}

run()
