import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { SAVE_EQUIPMENT } from '../utils/mutations';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useMutation } from "@apollo/client";
import { CloudinaryContext, Transformation, Image } from 'cloudinary-react';

const EditEquipment = () => {
        // Handles form data
        const [equipmentFormData, setEquipmentFormData] = useState({category: 'Guitar', brand: '', model: '', description:'', serialNumber:'', image: [], location: '', lost: false });
        const [saveEquipment] = useMutation(SAVE_EQUIPMENT);
        const [showAlert, setShowAlert] = useState(false);
        const [position, setPosition] = useState(null);
    
        useEffect(() => {
          },
          [equipmentFormData]);
          console.log(equipmentFormData);
        
        const handleInputChange = (event) => {
          const { name, value } = event.target;
          if (name === "lost" && value === "true"){
            setEquipmentFormData({...equipmentFormData, lost: true})
          } else if (name === "lost" && value === "false"){
            setEquipmentFormData({...equipmentFormData, lost: false})
          } else {
            setEquipmentFormData({ ...equipmentFormData, [name]: value});
          }
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
              if(equipmentFormData.brand.length && equipmentFormData.category.length && equipmentFormData.model.length && equipmentFormData.description.length && equipmentFormData.serialNumber.length && equipmentFormData.image.length && equipmentFormData.location.length){
              const {data} = await saveEquipment({
                variables: { input: {...equipmentFormData}}  
              });
              console.log(data)
              setEquipmentFormData({category: '', brand: '', model: '', description:'', serialNumber:'', image: [], location: '', lost: false });
              document.getElementById("category").value = '';
              document.getElementById("brand").value = '';
              document.getElementById("model").value = '';
              document.getElementById("description").value = '';
              document.getElementById("serialNumber").value = '';
              setShowAlert(false);
            } else {setShowAlert(true); return}
            } catch (err) {
              console.error(err);
              setShowAlert(true);
            }
            
        };
    
        // gets location of user and implements a draggable icon on the map
        function LocationMarker() {
            const [draggable, setDraggable] = useState(false);
            
            const markerRef = useRef(null)
        
            const map = useMap();
        
            useEffect(() => {
              map.locate().on("locationfound", function (e) {
                setPosition(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
              });
            }, [map]);
            
            const eventHandlers = useMemo(
                () => ({
                  dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                      setPosition(marker.getLatLng())
                    }
                  },
                }),
                [],
              )
              const toggleDraggable = useCallback(() => {
                setDraggable((d) => !d)
              }, [])

            return position === null ? null : (
              <Marker position={position} draggable={draggable} eventHandlers={eventHandlers} ref={markerRef}>
                <Popup >
                    <span onClick = {toggleDraggable} >
                        {draggable
                        ? 'The nearest location to where the equipment was lost or your current location.'
                        : 'The nearest location to where the equipment was lost or your current location. Click here to drag!'}
                    </span>     
                </Popup>    
              </Marker>
            );
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
                      console.log('before ',tempArray, equipmentFormData.image)
                      tempArray = tempArray.concat(equipmentFormData.image);
                      console.log('after ', tempArray)
                      setEquipmentFormData({...equipmentFormData, image: tempArray})
                    }
                });
          };

    return(
        <div className="editEquipmentContent mainContent">
          <div className="blackTable">
            <h2>Register Equipment</h2>
                <form onSubmit={handleFormSubmit} className="d-flex flex-column align-items-left lBlueTable equipmentForm">

                  <div>
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
                  
                  <div>                
                    <label htmlFor="brand">Brand: </label>
                    <input name="brand" id="brand" onChange={handleInputChange} className="textInput"/>
                  </div>

                  <div>
                    <label htmlFor="model">Model: </label>
                    <input name="model" id="model" onChange={handleInputChange} className="textInput"/>                
                  </div>

                  <div>
                    <label htmlFor="description">Description: </label>
                    <textarea name="description" id="description" onChange={handleInputChange} className="textInput"/>
                  </div>
                  
                  <div>
                    <label htmlFor="serialNumber">Serial Number: </label>
                    <input name="serialNumber" id="serialNumber" onChange={handleInputChange} className="textInput"/>
                  </div>
                  
                  <div>
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
                  <div className="align-self-center">
                  
                    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{height: "20vw", width:"30vw"}}>
                        <TileLayer
                            attribution='Open Street Maps'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker />  
                    </MapContainer>
                  </div>
                    
                  <div className="d-flex flex-row">
                    <label htmlFor="lost">Is the equipment lost? </label>
                    <span className="textInput d-flex align-items-center justify-content-end">
                      <input type="radio" value={true} name="lost" onChange={handleInputChange} className="radioInput"/> Yes
                      <input type="radio" value={false} name="lost" onChange={handleInputChange} className="radioInput"/> No
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