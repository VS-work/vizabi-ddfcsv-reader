import { cloneDeep, isArray } from 'lodash';
import { ContentManager } from '../content-manager';
import { IReader } from '../file-readers/reader';
import { RequestNormalizer } from '../request-normalizer';
import { IDdfAdapter } from './adapter';

export class EntitySchemaAdapter implements IDdfAdapter {
  public contentManager: ContentManager;
  public reader: IReader;
  public ddfPath: string;
  public requestNormalizer: RequestNormalizer;
  public request;
  public baseData: any[];
  public entitiesFromDataPackage: any[];

  constructor(contentManager, reader, ddfPath) {
    this.contentManager = contentManager;
    this.reader = cloneDeep(reader);
    this.ddfPath = ddfPath;
  }

  addRequestNormalizer(requestNormalizer) {
    this.requestNormalizer = requestNormalizer;

    return this;
  }

  getExpectedSchemaDetails(request, dataPackageContent) {
    const isEntity = record => !isArray(record.schema.primaryKey) && record.schema.primaryKey !== 'concept';

    this.baseData = [];
    this.entitiesFromDataPackage = dataPackageContent.resources.filter(record => isEntity(record));

    for (let record of this.entitiesFromDataPackage) {
      for (let field of record.schema.fields) {
        this.baseData.push({key: [record.schema.primaryKey], value: field.name});
      }
    }


    return this.entitiesFromDataPackage;
  }

  getNormalizedRequest(requestParam, onRequestNormalized) {
    this.request = requestParam;

    onRequestNormalized(null, requestParam);
  }

  getRecordTransformer() {
    return record => record;
  }

  getFileActions() {
    return [];
  }

  getFinalData(results) {
    return this.baseData;
  }
}
