
const MeetingHistory = require('../../model/schema/meeting');
const mongoose = require('mongoose');
require('../../model/schema/contact');
require('../../model/schema/lead');
require('../../model/schema/user');

// function to create/add newMeeting 
const add = async (req, res) => {
   try {
    const newMeeting = new MeetingHistory(req.body);
    await newMeeting.save();
    console.log(`newMeeting: ${newMeeting}`);
    res.status(201).json(newMeeting)

   } catch(error) {
    res.status(400).json({ message: error.message})
   }
}
// get all the meetings
const index = async (req, res) => {
    
    try {
        const meetings = await MeetingHistory.find({deleted: false})
            .populate('attendes')
            .populate('attendesLead')
            .populate('createBy');
        
        res.status(200).json(meetings)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
};
// get single meeting by id
const view = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findById(req.params.id)
        .populate('attendes')
        .populate('attendesLead')
        .populate('createBy')
        .lean();

        if(!meeting || meeting.deleted) {
            return res.status(404).json({message: 'Meeting not found or was deleted'});
        }

        res.status(200).json(meeting);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

const deleteData = async (req, res) => {
    try {
        const updated = await MeetingHistory.findByIdAndUpdate(
            req.params.id,
            { deleted: true },
            { new: true }
        );

        if(!updated) return res.status(404).json({ message: 'Meeting not found'})
            
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message});
    };
}

const deleteMany = async (req, res) => {
    try {
        const { ids } = req.body;
        const objectIds = ids.map(id => new mongoose.Types.ObjectId(id))
        const result = await MeetingHistory.updateMany(
            { _id: { $in: objectIds } },
            { $set: { deleted: true } }
        );

        res.status(200).json({
            message: 'Meetings deleted successfully',
            modifiedCount: result.modifiedCount,
            matchedCount: result.matchedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

module.exports = { add, index, view, deleteData, deleteMany }