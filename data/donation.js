import {donations} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helper from "../helpers.js";
import validation from "../validation.js";
import {charityData} from './data/charities.js';


const createDonation = async (
    userName,
    charityName,
    giftName,
    giftNote,
    comments,
    donateDate
)=>{

    userName = helper.checkString(userName, 'userName');
    charityName = helper.checkString(charityName, 'charityName');
    giftName = helper.checkString(giftName, 'giftName');
    giftNote = helper.checkString(giftNote, 'giftNote');
    comments = validation.checkString(comments, 'comments');
    donateDate = validation.checkDate(donateDate, 'donateDate');


    let newDonation = {
        userName: userName,
        charityName: charityName,
        giftName: giftName,
        giftNote: [],
        comments: [],
        donateDate:donateDate
      } 

    const donationCollection = await donations();
    const insertInfo = await donationCollection.insertOne(newDonation);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not add donation';
    } else {
          return newDonation;
    }


};

  

const getById = async (id) => {

    id = validation.checkId(id, 'Donation Id')

    const donationCollection = await donations();
    const donation = await donationCollection.findOne({_id: new ObjectId(id)});

    if (!donation) throw 'No donation found with that id';
        donation._id = donation._id.toString();
    return donation;
  };


const getByUsername = async (userName) => {

    if(!userName) throw 'Username is required.';

    userName = validation.checkString(userName, 'Donator username')

    const donationCollection = await donations();
    const donation = await donationCollection.findOne({userName: userName});

    if (!donation) throw 'No donation found with that username';
    return donation;
  };


  const getByCharityname = async (charityName) => {

    if(!charityName) throw 'Charity name is required.';

    charityName = validation.checkString(charityName, 'charity name')

    const donationCollection = await donations();
    const donation = await donationCollection.findOne({charityName: charityName});

    if (!donation) throw 'No donation found with that username';
    return donation;
  };

  
  const getByGiftname = async (giftName) => {

    if(!giftName) throw 'Gift name is required.';

    giftName = validation.checkString(giftName, 'gift name')

    const donationCollection = await donations();
    const donation = await donationCollection.findOne({giftName: giftName});

    if (!donation) throw 'No donation found with that username';
    return donation;
  };



const getAllDonations = async () => {

    const donationCollection = await donations();
    const donationList = await donationCollection.find({}).toArray();

    if (!donationList) throw 'Could not get all donations';
        return donationList;
  };


const getByDonatedate = async (donateDate) => {

    if(!donateDate) throw 'Donate date is required.';

    donateDate = validation.checkDate(donateDate, 'donate date');

    const donationCollection = await donations();
    const charityCollection = await charieties();

    const donation = await donationCollection.findOne({donateDate: donateDate});

    //This part still has logic error, not sure what the parameter should be. But please compare the date with current date and create date
    const charity = await charityCollection.findOne({donateDate: donateDate}); 
    if (!charity || !charity.createDate) throw 'No charity or creation date found.';
    const createDate = new Date(charity.createDate);


    const currentDate = new Date();


    if (donateDate.getTime() > createDate.getTime()) {
        console.log("Donation date correct. It is after the creation date.");
    } else if (donateDate.getTime() === createDate.getTime()) {
        console.log("Donation date is the same as the creation date.");
    } else {
        console.log("Donation date error.It is before the creation date.");
    }


    if (donateDate.getTime() > currentDate.getTime()) {
        console.log("Donation date error. It is in the future.");
    } else if (donateDate.getTime() === currentDate.getTime()) {
        console.log("Donation date is today.");
    } else {
        console.log("Donation date correct. It is in the past.");
    }


    if (!donation) throw 'No donation found with that username';
    return donation;

};

const calculateAmountByDonationId = async (id) => {

    if(!id) throw 'Donation Id is required.';

    const donationCollection = await donations();
    const donationList = await donationCollection.findOne({_id: new ObjectId(id)});

    if (!donationList || donationList.length === 0) 
        throw 'No donation found.';

    let donationSum = 0;
    
    donationList.forEach(donation => {
        donationSum += donation.giftName.price;
    });

    if (!donationList) throw 'No donation found.';
        return donationSum;

};


const calculateAmountByUsername = async (userName) => {

    if(!userName) throw 'Username is required.';

    const donationCollection = await donations();
    const donationList = await donationCollection.getByUserName(userName).toArray();

    if (!donationList || donationList.length === 0) 
        throw 'No donation found.';

    let donationSum = 0;
    
    donationList.forEach(donation => {
        donationSum += donation.giftName.price;
    });

    if (!donationList) throw 'No donation found.';
        return donationSum;

};


const addCommentByCharityname = async (charityName, comment) => {

    if(!charityName || !comment) throw 'Charity name and comment are required.';

    const donationCollection = await donations();
    
    const existingDonationWithComment = await donationCollection.findOne({
        charityName: charityName,
        comment: { $exists: true }
    });

    if (existingDonationWithComment) {
        throw 'A comment for this charity already exists. Only one comment is allowed per charity.';
    }

    const updateResult = await donationCollection.updateOne({charityName:charityName}, {$set: {comment: comment}});
    
    if (updateResult.modifiedCount === 0) {
        throw 'Failed to update the donation with comment.';
    }

    return {message: "Comment added successfully."};

};

//not sure about the donationId parameter
const addComment = async (donationId, comment) => {

    if(!donationId || !comment) throw 'Donation ID and comment are required.';

    const donationCollection = await donations();
    const updateResult = await donationCollection.updateOne({_id: new ObjectId(donationId)}, {$set: {comment: comment}});
    
    if (updateResult.modifiedCount === 0) {
        throw 'Failed to update the donation with comment.';
    }

    return {message: "Comment added successfully."};

};

//same as the above one
const divideDonation = async (donationId) => {

    if(!donationId) throw 'Donation ID is required.';

    const donationCollection = await donations();
    const charityCollection = await charities();

    const donation = await donationCollection.findOne({_id: new ObjectId(donationId)});
    if (!donation) throw 'No donation found.';

    const charityCount = await charityCollection.countDocuments();
    if (charityCount === 0) throw 'No charities found to divide the donation among.';

    const dividedAmount = donation.giftName.price / charityCount;

    return { dividedAmountPerPart: dividedAmount };



};



