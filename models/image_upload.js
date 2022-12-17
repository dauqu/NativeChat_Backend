const mongoose = require('mongoose');
const detail_with_image = mongoose.Schema({
   name: {
         type: String,
   },
   designation: {
            type: String,
   },
   avatar: {
        type: String, 
        
}
    

})
module.exports = mongoose.model('detail_with_image', detail_with_image);