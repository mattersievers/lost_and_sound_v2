import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { SAVE_EQUIPMENT } from '../utils/mutations';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useMutation } from "@apollo/client";
import { CloudinaryContext, Transformation, Image } from 'cloudinary-react';

const EditEquipment = () => {
        // Handles form data
        const [equipmentFormData, setEquipmentFormData] = useState({category: '', brand: '', model: '', description:'', serialNumber:'', image: [], location: '', lost: false });
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
            } else {setShowAlert(true); return}
            } catch (err) {
              console.error(err);
              setShowAlert(true);
            }
            setEquipmentFormData({category: '', brand: '', model: '', description:'', serialNumber:'', image: [], location: '', lost: false });
            document.getElementById("category").value = '';
            document.getElementById("brand").value = '';
            document.getElementById("model").value = '';
            document.getElementById("description").value = '';
            document.getElementById("serialNumber").value = '';
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

          //widget functionality
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
            <h2>Register Equipment</h2>
                <form onSubmit={handleFormSubmit}>

                  <label htmlFor="category">Category: </label>
                  <input name="category" type="category" id="category" onChange={handleInputChange}/>

                  <label htmlFor="brand">Brand: </label>
                  <input name="brand" id="brand" onChange={handleInputChange}/>

                  <label htmlFor="model">Model: </label>
                  <input name="model" id="model" onChange={handleInputChange}/>

                  <label htmlFor="description">Description: </label>
                  <input name="description" id="description" onChange={handleInputChange}/>

                  <label htmlFor="serialNumber">Serial Number: </label>
                  <input name="serialNumber" id="serialNumber" onChange={handleInputChange}/>

                  <label htmlFor="image">Image: </label>
                  
                    {equipmentFormData.image.map((singleImage, i) => {
                      return (
                      <CloudinaryContext cloudName="dgeknrish" key={i}>
                        <Image publicId={singleImage} className="equipImage">
                          <Transformation width="200" crop="scale" />
                        </Image>
                      </CloudinaryContext> 
                      )
                    })}
                  <button onClick={uploadWidget.bind(this)} className="upload-button">
                    Upload Image
                  </button>

                  <label htmlFor="location">Location: </label>
                  <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{height: "50vh", width:"35vw"}}>
                      <TileLayer
                          attribution='Open Street Maps'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker />  
                  </MapContainer>
                    
                
                  <label htmlFor="lost">Is the equipment lost? </label>
                  <input type="radio" value={true} name="lost" onChange={handleInputChange}/> Yes
                  <input type="radio" value={false} name="lost" onChange={handleInputChange}/> No
                  
                  
                  {showAlert && <p>Something went wrong. Make sure the form is complete and try again.</p>}
                  <button type="submit" >Submit</button>
                </form>
        </div>
    );
};

export default EditEquipment;