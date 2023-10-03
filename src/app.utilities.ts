import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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

  public static async validator(
    password: string,
    hashedPassword: string,
  ): Promise<any> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public static async hasher(string: string): Promise<any> {
    const roundsOfHashing = 10;
    return await bcrypt.hash(string, roundsOfHashing);
  }

  public static encode(
    data: string,
    encoding: BufferEncoding = 'base64',
  ): string {
    return Buffer.from(data).toString(encoding);
  }

  public static decode(
    data: string,
    encoding: BufferEncoding = 'base64',
  ): string {
    return Buffer.from(data, encoding).toString();
  }
}
