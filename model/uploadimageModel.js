import mongose from 'mongoose'
const imageSchema = new mongose.Schema({
    imagename :{
        type:String
    }
})







const imageModel = mongose.model("imagedetail",imageSchema);

export default imageModel