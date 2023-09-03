import type { RouterContext } from '../deps.ts';
import { User } from '../models/user.ts';
import omitFields from '../utils/omitfields.ts';
import type { UpdateUserProfile,GetUser } from "../schema/user.ts";
import { isRouterContext } from 'https://deno.land/x/oak@v11.1.0/util.ts';
const getMeController = async ({ state, response }: RouterContext<string>) => {
  try {
    const user = await User.findOne({ _id: state.userId });

    if (!user) {
      response.status = 401;
      response.body = {
        status: 'fail',
        message: 'The user belonging to this token no longer exists',
      };
      return;
    }

    response.status = 200;
    response.body = {
      status: 'success',
      user: omitFields(user, 'password'),
     
    };
  } catch (error) {
    response.status = 500;
    response.body = {
      status: 'success',
      message: error.message,
    };
    return;
  }
};

const pay=async({state,response}:RouterContext<string>)=>{
  try{
    const use_r = await User.findOne({ _id: state.userId });

    if (!use_r) {
      response.status = 401;
      response.body = {
        status: 'fail',
        message: 'The user belonging to this token no longer exists',
      };
      return;
    }
    if(use_r.verified==true){
      response.status = 401;
      response.body = {
        status: 'fail',
        message: 'You have already paid the verification fees',
      };
      return;
    }
    
    const user=await User.updateOne(
      {_id: state.userId},
      { $set: {  verified: true } },
      { ignoreUndefined: true }
    )
    if(!user.matchedCount){
      response.status=401;
      response.body = {
        status: 'fail',
        message: 'The user belonging to this token no longer exists',
      };
      return;

    }
    response.body={
      status: 'success',
      message: 'The user is now virified',
    }
    return;

  }catch(error){
    response.status = 500;
    response.body = {
      status: 'fail',
      message: error.message,
    };
    return;
  }
}

const updateProfile=async({state,request,response}:RouterContext<string>)=>{
  try{
    const { name,imageUrl }: UpdateUserProfile = await request.body()
  .value;
  const updatedInfo = await User.updateOne(
    { _id: state.userId },
    { $set: { name:name,imageUrl:imageUrl, updatedAt: new Date() } },
    { ignoreUndefined: true }
  );
  if (!updatedInfo.matchedCount) {
    response.status = 404;
    response.body = {
      status: 'fail',
      message: 'No User with that Id exists',
    };
    return;
  }
  const updatedUser = await User.findOne({ _id: state.userId });
  response.status = 200;
  response.body = {
    status: 'success',
    data: omitFields(updatedUser, 'password'),
  };
  }catch(error){
      response.status = 500;
      response.body = { status: 'error', message: error.message };
      return;
  }
 
}

const getUser=async({response,params}:RouterContext<string>)=>{
  try{
    const user = await User.findOne({ email: params.email });
    if(!user){
      response.status = 401;
      response.body = {
        status: 'fail',
        message: 'No user with this email found',
      };
      return;
    }
    response.status = 200;
    response.body = {
      status: 'success',
      user: omitFields(user, 'password'),

  }
  return
}catch(error){
  response.status = 500;
    response.body = {
      status: 'fail',
      message: error.message,
    };
    return;
}
}

export default { getMeController,pay,updateProfile,getUser };
