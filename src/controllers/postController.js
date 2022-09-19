import { _ } from 'ajv';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import _m from 'moment';

dotenv.config();

import { httpStatus } from '../configs/httpStatus';
import { addPost, getMostLike } from '../services/postService';

const newPost = async (req, res) => {
  const { file, body } = req;

  console.log(file);
  try {
    const [_, tail] = file.mimetype.split('/');

    const result = await addPost({
      owner: req.jwtObject.username,
      tail,
      buffer: file.buffer,
      content: body.textContent,
    });

    if (!result.isOk)
      return res.status(httpStatus.ok).send({
        isOk: false,
        msg: result.msg,
      });

    return res.status(httpStatus.ok).send({
      isOk: true,
      data: result.data,
      msg: result.msg,
    });
  } catch (e) {
    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on new post',
    });
  }
};

const getPopular = async (req, res) => {
  try {
    const result = await getMostLike();

    if (!result.isOk)
      return res.status(httpStatus.ok).send({
        isOk: false,
        msg: result.msg,
      });
    const format = result.data.map((item) => {
      const formatData =
        _m(item.dateTime).fromNow().split(' ')[0] > 24
          ? _m(item.dateTime).format('MMM Do YY')
          : _m(item.dateTime).fromNow();
      return {
        id: item.id,
        username: item.Users.username,
        name: `${item.Users.fname} ${item.Users.lname}`,
        profileImage: item.Users.avatar,
        dateTime: formatData,
        postContent: item.postContent,
        isLike: item.likeBy.includes(req.jwtObject.username),
        likeCount: item.likeCount,
        imageUrl: item.imageUrl || null,
        comment: [],
      };
    });

    return res.status(httpStatus.ok).send({
      isOk: true,
      data: format,
      msg: result.msg,
    });
  } catch (e) {
    console.log(e);
    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on top like',
    });
  }
};

const updateLike = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);

    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on updateLike',
    });
  }
};

export { newPost, getPopular };
