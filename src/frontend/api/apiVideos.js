import axios from 'axios';

const API_GET_VIDEOS ="/list/videos/mcu";

const getVideosList = async() => {
	try{
		let videos = await axios.get(API_GET_VIDEOS);
	}catch(error){
		let videos = [];
	}
	return videos;
}

export default getVideosList;