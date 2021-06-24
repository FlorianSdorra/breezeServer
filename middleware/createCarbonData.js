import Carbon from "../models/carbon.js";

const createCarbonData = async () => {
  var date = new Date(); 
  var now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

  const utcDate = new Date(now_utc);
  try {
    const carbon = new Carbon({
      value: Math.floor(Math.random() * 3500 - 401) + 400,
      time: utcDate,
    });

    const data = await carbon.save();
    return data;
  } catch (error) {
    return error;
  }
};

export default createCarbonData;