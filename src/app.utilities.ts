import { Injectable } from '@nestjs/common';

@Injectable()
export class AppUtilities {
  public static removeSensitiveData(object: any, remove: string) {
    if (typeof object !== 'object') return;
    const insensitiveData = object.map((obj) => {
      const { [remove]: _, ...items } = obj;
      return { ...items };
    });
    return insensitiveData;
  }

  public static removePasswordForAuthorSelect(): Record<string, true> {
    const authorFields = [
      'id',
      'firstName',
      'lastName',
      'email',
      'displayName',
      'createdAt',
      'updatedAt',
    ];

    return authorFields.reduce((selectObject, field) => {
      selectObject[field] = true;
      return selectObject;
    }, {});
  }

  public static selectMultipleData(fields: any[]): Record<string, true> {
    return fields.reduce((selectObject, field) => {
      selectObject[field] = true;
      return selectObject;
    }, {});
  }
}
