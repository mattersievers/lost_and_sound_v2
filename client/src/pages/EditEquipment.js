import React, { useEffect, useState } from "react";
import { GET_MY_EQUIPMENT } from '../utils/queries'
import { SAVE_EQUIPMENT, UPDATE_EQUIPMENT } from '../utils/mutations';
import { MapContainer, TileLayer} from 'react-leaflet';
import { useMutation, useQuery } from "@apollo/client";
import { CloudinaryContext, Transformation, Image } from 'cloudinary-react';
import LocationMarker from "../components/LocationMarker";

const EditEquipment = (props) => {
  // Handles form data
  const [equipmentFormData, setEquipmentFormData] = useState({category: 'Guitar', brand: '', model: '', description:'', serialNumber:'', image: [], location: '', lost: false });
  const [saveEquipment] = useMutation(SAVE_EQUIPMENT);
  const [updateEquipment] = useMutation(UPDATE_EQUIPMENT);
  const {loading, data:userData} = useQuery(GET_MY_EQUIPMENT);
  const [showAlert, setShowAlert] = useState(false);
  const [position, setPosition] = useState(null);
  const [locationMarked, setLocationMarked] = useState(false);
  useEffect(()=>{
    if(props.location.state && userData){
      const currentInstrumentLoad = userData.me.savedEquipment.filter(equipment => equipment._id === props.location.state[0]);
      setLocationMarked(true);
      setEquipmentFormData({category: currentInstrumentLoad[0].category, brand: currentInstrumentLoad[0].brand, model:currentInstrumentLoad[0].model, description:currentInstrumentLoad[0].description, serialNumber:currentInstrumentLoad[0].serialNumber, image:currentInstrumentLoad[0].image, location:currentInstrumentLoad[0].location, lost:currentInstrumentLoad[0].lost}) 
    }
  },[userData,props.location.state])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "lost" && value === "true"){
      setEquipmentFormData({...equipmentFormData, lost: true})
    } else if (name === "lost" && value === "false"){
      setEquipmentFormData({...equipmentFormData, lost: false})
    } else {
      setEquipmentFormData({ ...equipmentFormData, [name]: value});
    }
    console.log(equipmentFormData)
  };

  const handleFormSubmit= async(event)=>{
      event.preventDefault();
      setEquipmentFormData({ ...equipmentFormData, location: position.toString()});

      console.log("submitted: ", equipmentFormData)

      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      try{
        if(equipmentFormData.brand.length && equipmentFormData.category.length && equipmentFormData.model.length && equipmentFormData.description.length && equipmentFormData.serialNumber.length && equipmentFormData.image.length && equipmentFormData.location.length && !props.location.state){
        const {data} = await saveEquipment({
          variables: { input: {...equipmentFormData}}  
        });
        console.log(data);
        setEquipmentFormData({category: '', brand: '', model: '', description:'', serialNumber:'', image: [], location: '', lost: false });
        document.getElementById("category").value = '';
        document.getElementById("brand").value = '';
        document.getElementById("model").value = '';
        document.getElementById("description").value = '';
        document.getElementById("serialNumber").value = '';
        document.getElementById("radioButton1").checked = false;
        document.getElementById("radioButton2").checked = false;
        setShowAlert(false);
      } else if(equipmentFormData.brand.length && equipmentFormData.category.length && equipmentFormData.model.length && equipmentFormData.description.length && equipmentFormData.serialNumber.length && equipmentFormData.image.length && equipmentFormData.location.length && props.location.state) {
        const {data} = await updateEquipment({
          variables: { input: {...equipmentFormData, _id:props.location.state[0]}}
        });
        console.log(data);
        setEquipmentFormData({category: '', brand: '', model: '', description:'', serialNumber:'', image: [], location: '', lost: false });
        document.getElementById("category").value = '';
        document.getElementById("brand").value = '';
        document.getElementById("model").value = '';
        document.getElementById("description").value = '';
        document.getElementById("serialNumber").value = '';
        document.getElementById("radioButton1").checked = false;
        document.getElementById("radioButton2").checked = false;
        setShowAlert(false);
      } else {setShowAlert(true); return}
      } catch (err) {
        console.error(err);
        setShowAlert(true);
      }
      
  };


  //photo widget functionality
  function uploadWidget() {
    let tempArray = [];
    window.cloudinary.openUploadWidget({ cloud_name: 'dgeknrish', upload_preset: 'LostAndSoundPics', tags:['musical equipment']},
      
      function(error, result) {
            //single image upload is successful
            if(result.event === "success")  {
              tempArray.push(result.info.public_id)
            }
            //widget is closed and image array is updated
            if (result.event === "close"){
              tempArray = tempArray.concat(equipmentFormData.image);
              setEquipmentFormData({...equipmentFormData, image: tempArray})
            }
        });
  };

  if(props.location.state && loading){
    return(
      <h1>Loading...</h1>
    )
  }

  //if props are present, user is editing and existing piece of equipment. This fills out form with the proper info from the database.
  if(props.location.state && !loading){
    const currentInstrument = userData.me.savedEquipment.filter(equipment => equipment._id === props.location.state[0]);
    let itemLatLng = currentInstrument[0].location.split(')').join(',').split('(').join(',').split(',');
    let coordinate1 = itemLatLng[1];
    let coordinate2 = itemLatLng[2];
    
    return(
      <div className="editEquipmentContent mainContent">
      <div className="blackTable">
        <h2>Register Equipment</h2>
            <form onSubmit={handleFormSubmit} className="d-flex flex-column align-items-left lBlueTable equipmentForm">

              <div className="singleSelection">
                <label htmlFor="category">Category: </label>
                <select name="category" type="category" id="category" onChange={handleInputChange} className="textInput" value={equipmentFormData.category}>
                  <option value="Guitar">Guitar</option>
                  <option value="Bass">Bass</option>
                  <option value="Drums">Drums</option>
                  <option value="Keyboard">Keyboard/Piano</option>
                  <option value="Amp">Amp/Speaker</option>
                  <option value="Pedals">Pedal/Effect/Mixer</option>
                  <option value="Brass">Horn/Brass</option>
                  <option value="Woodwind">Woodwind</option>
                  <option value="Reed">Reed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="singleSelection">                
                <label htmlFor="brand">Brand: </label>
                <input name="brand" id="brand" onChange={handleInputChange} className="textInput" value={equipmentFormData.brand}/>
              </div>

              <div className="singleSelection">
                <label htmlFor="model">Model: </label>
                <input name="model" id="model" onChange={handleInputChange} className="textInput" value={equipmentFormData.model}/>                
              </div>

              <div className="singleSelection">
                <label htmlFor="description">Description: </label>
                <textarea name="description" id="description" onChange={handleInputChange} className="textInput" value={equipmentFormData.description}/>
              </div>
              
              <div className="singleSelection">
                <label htmlFor="serialNumber">Serial Number: </label>
                <input name="serialNumber" id="serialNumber" onChange={handleInputChange} className="textInput"  value={equipmentFormData.serialNumber}></input>
              </div>
              
              <div className="singleSelection">
                <label htmlFor="image">Images: </label>
                <button onClick={uploadWidget.bind(this)} className="upload-button">
                  Upload Image
                </button>
              </div>
              <div className="d-flex flex-column align-items-center uploadPics">
                {equipmentFormData.image.map((singleImage, j) => {
                    return (
                    <CloudinaryContext cloudName="dgeknrish" key={j}>
                      <Image publicId={singleImage} className="equipImage">
                        <Transformation width="200" crop="scale" />
                      </Image>
                    </CloudinaryContext> 
                    )
                })}
              </div>
              

              <label htmlFor="location"></label>
              <div className="align-self-center mapContainer">
              
                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{height: "20vw", width:"30vw"}}>
                    <TileLayer
                        attribution='Open Street Maps'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker 
                    position={position}
                    setPosition={setPosition}
                    locationMarked={locationMarked}
                    setLocationMarked={setLocationMarked}
                    coordinate1 = {coordinate1}
                    coordinate2 = {coordinate2}
                     />
                </MapContainer>
              </div>
                
              <div className="d-flex flex-row singleSelection">
                <label htmlFor="lost">Is the equipment lost? </label>
                <span className="textInput d-flex align-items-center justify-content-end">
                  <input type="radio" value={true} name="lost" onChange={handleInputChange} id="radioButton1" className="radioInput" checked={currentInstrument[0].lost}/> Yes
                  <input type="radio" value={false} name="lost" onChange={handleInputChange} id="radioButton2" className="radioInput" checked={!currentInstrument[0].lost}/> No
                </span>
              </div>
              
              
              {showAlert && <p>Something went wrong. Make sure the form is complete and try again.</p>}

              <div className="align-self-center">
                <button type="submit" >Submit</button>
              </div>
              
            </form>
          </div>     
    </div>
    )
  }

  //props were not present. User is adding new equipment.
  return(
      <div className="editEquipmentContent mainContent">
        <div className="blackTable">
          <h2>Register Equipment</h2>
              <form onSubmit={handleFormSubmit} className="d-flex flex-column align-items-left lBlueTable equipmentForm">

                <div className="singleSelection">
                  <label htmlFor="category">Category: </label>
                  <select name="category" type="category" id="category" onChange={handleInputChange} className="textInput">
                    <option value="Guitar">Guitar</option>
                    <option value="Bass">Bass</option>
                    <option value="Drums">Drums</option>
                    <option value="Keyboard">Keyboard/Piano</option>
                    <option value="Amp">Amp/Speaker</option>
                    <option value="Pedals">Pedal/Effect/Mixer</option>
                    <option value="Brass">Horn/Brass</option>
                    <option value="Woodwind">Woodwind</option>
                    <option value="Reed">Reed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="singleSelection">                
                  <label htmlFor="brand">Brand: </label>
                  <input name="brand" id="brand" onChange={handleInputChange} className="textInput" />
                </div>

                <div className="singleSelection">
                  <label htmlFor="model">Model: </label>
                  <input name="model" id="model" onChange={handleInputChange} className="textInput"/>                
                </div>

                <div className="singleSelection">
                  <label htmlFor="description">Description: </label>
                  <textarea name="description" id="description" onChange={handleInputChange} className="textInput"/>
                </div>
                
                <div className="singleSelection">
                  <label htmlFor="serialNumber">Serial Number: </label>
                  <input name="serialNumber" id="serialNumber" onChange={handleInputChange} className="textInput"/>
                </div>
                
                <div className="singleSelection">
                  <label htmlFor="image">Images: </label>
                  <button onClick={uploadWidget.bind(this)} className="upload-button">
                    Upload Image
                  </button>
                </div>
                <div className="d-flex flex-column align-items-center uploadPics">
                  {equipmentFormData.image.map((singleImage, i) => {
                      return (
                      <CloudinaryContext cloudName="dgeknrish" key={i}>
                        <Image publicId={singleImage} className="equipImage">
                          <Transformation width="200" crop="scale" />
                        </Image>
                      </CloudinaryContext> 
                      )
                  })}
                </div>
                

                <label htmlFor="location"></label>
                <div className="align-self-center mapContainer">
                
                  <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{height: "20vw", width:"30vw"}}>
                      <TileLayer
                          attribution='Open Street Maps'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker 
                      position={position}
                      setPosition={setPosition}
                      locationMarked={locationMarked}
                      setLocationMarked={setLocationMarked} />
                  </MapContainer>
                </div>
                  
                <div className="d-flex flex-row singleSelection">
                  <label htmlFor="lost">Is the equipment lost? </label>
                  <span className="textInput d-flex align-items-center justify-content-end">
                    <input type="radio" value={true} name="lost" onChange={handleInputChange} id="radioButton1" className="radioInput"/> Yes
                    <input type="radio" value={false} name="lost" onChange={handleInputChange} id="radioButton2" className="radioInput"/> No
                  </span>
                </div>
                
                
                {showAlert && <p>Something went wrong. Make sure the form is complete and try again.</p>}

                <div className="align-self-center">
                  <button type="submit" >Submit</button>
                </div>
                
              </form>
            </div>     
      </div>
  );
};

export default EditEquipment;