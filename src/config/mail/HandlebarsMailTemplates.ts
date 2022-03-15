import handlebars from 'handlebars';
import fs from 'fs';

interface ITemlateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: string;
  variables: ITemlateVariable;
}

export default class handlebarsMailTemplate {
  public async parse({ file, variables }: IParseMailTemplate): Promise<string> {
    const templaFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templaFileContent);
    return parseTemplate(variables);
  }
}
