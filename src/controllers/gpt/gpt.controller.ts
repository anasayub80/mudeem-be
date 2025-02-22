import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';
import mongoose from 'mongoose';
import SuccessHandler from '../../utils/successHandler';
import Chat from '../../models/gpt/chat.model';
import { generateAiResponse, createThread } from '../../utils/openai';

const sendMessage: RequestHandler = async (req, res) => {
  // #swagger.tags = ['gpt']
  try {
    if (!req.user?.isSubscribed) {
      return ErrorHandler({
        message: 'You need to subscribe to access this feature',
        statusCode: 403,
        req,
        res
      });
    }
    const exChat = await Chat.findOne({
      user: req.user?._id
    });
    if (!exChat) {
      const thread = await createThread();
      const messageText = await generateAiResponse(thread, req.body.message, [
        'environment',
        'greenry'
      ]);
      const pattern = /【\d+:\d+†source】/g;
      const response = messageText?.replace(pattern, ''); // remove source
      let initialMessages = [];
      initialMessages.push({ sender: 'user', content: req.body.message });
      initialMessages.push({ sender: 'bot', content: response });
      const chat = await Chat.create({
        user: req.user?._id,
        messages: initialMessages,
        thread
      });
      return SuccessHandler({
        res,
        data: { response },
        statusCode: 201
      });
    } else {
      // gpt prompt
      const messageText = await generateAiResponse(
        exChat.thread,
        req.body.message,
        ['environment', 'greenry']
      );
      const pattern = /【\d+:\d+†source】/g;
      const response = messageText?.replace(pattern, ''); // remove source
      //@ts-ignore
      exChat.messages.push({ sender: 'user', content: req.body.message });
      //@ts-ignore
      exChat.messages.push({ sender: 'bot', content: response });
      await exChat.save();
      return SuccessHandler({
        res,
        data: { chat: response },
        statusCode: 200
      });
    }
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};
const getChat: RequestHandler = async (req, res) => {
  // #swagger.tags = ['gpt']
  try {
    const chat = await Chat.findOne({
      user: req.user?._id
    });
    if (!req.user?.isSubscribed) {
      return ErrorHandler({
        message: 'You need to subscribe to access this feature',
        statusCode: 403,
        req,
        res
      });
    }
    if (!chat) {
      return ErrorHandler({
        message: 'Chat not found',
        statusCode: 404,
        req,
        res
      });
    }
    return SuccessHandler({
      res,
      data: { chat: chat },
      statusCode: 200
    });
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

export { sendMessage, getChat };
