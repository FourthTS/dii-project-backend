import moment from 'moment';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '../configs/connectStorage';
import { v4 } from 'uuid';

import { hashString } from '../libs/DecryptEncryptString';
import randAvatar from '../libs/randomAvatar';

dotenv.config();

const prisma = new PrismaClient();

const getOneCredential = async (username) => {
  try {
    const userData = await prisma.users.findUnique({
      where: {
        username,
      },
    });

    return {
      isOk: true,
      data: userData,
      msg: userData == null ? 'no error but user not found' : '',
    };
  } catch (e) {
    return {
      isOk: false,
      data: null,
      msg: 'Internal error',
    };
  }
};

const addUser = async (data) => {
  try {
    const randString = v4();

    const [hashedPassword, png] = await Promise.all([
      hashString(data.password),
      randAvatar(randString),
    ]);
    const storageUrl =
      'https://oijsgpmyxcrqexaewofb.supabase.co/storage/v1/object/public/';

    const x = await storageClient
      .from('dii-project-bucket')
      .upload(`avatar/${randString}.png`, png, {
        cacheControl: '3600',
        upsert: false,
      });

    if (x.error) throw new Error(x.error);

    const imageUrl = `${storageUrl}${x.data.Key}`;

    await prisma.users.create({
      data: {
        fname: data.firstName,
        lname: data.lastName,
        email: data.email,
        avatar: imageUrl,
        username: data.username,
        password: hashedPassword.hash,
      },
    });
    return {
      isOk: true,
      msg: 'create success',
    };
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        return {
          success: false,
          data: {},
          msg: `This ${e.meta.target.join(',')} is already taken`,
        };
      }
      return {
        success: false,
        data: {},
      };
    }

    return {
      success: false,
      data: {},
      msg: 'Internal Server Error Agent',
    };
  }
};
export { addUser, getOneCredential };
