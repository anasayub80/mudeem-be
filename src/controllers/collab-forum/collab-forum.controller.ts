import { RequestHandler } from 'express';

const createPost: RequestHandler = async (req, res) => {};
const getAllPosts: RequestHandler = async (req, res) => {};
const getPost: RequestHandler = async (req, res) => {};
const updatePost: RequestHandler = async (req, res) => {};
const likeUnlikePost: RequestHandler = async (req, res) => {};
const createComment: RequestHandler = async (req, res) => {};
const deleteComment: RequestHandler = async (req, res) => {};
const likeUnlikeComment: RequestHandler = async (req, res) => {};
const createReply: RequestHandler = async (req, res) => {};

export {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  likeUnlikePost,
  createComment,
  deleteComment,
  likeUnlikeComment,
  createReply
};
