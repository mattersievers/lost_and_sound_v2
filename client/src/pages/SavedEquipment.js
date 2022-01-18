import React from "react";
import { useQuery } from '@apollo/client';
import { GET_MY_EQUIPMENT } from "../utils/queries";
import { CloudinaryContext, Transformation, Image } from 'cloudinary-react';


const SavedEquipment = () => {
    const { loading, data: userData } = useQuery(GET_MY_EQUIPMENT);
    
    if(loading) {
        return <h1> LOADING... </h1>
    }
    return(
        <div className="savedEquipmentContent mainContent">
            <h1 className="userName">
                {userData.me.savedEquipment.length 
                ? `${userData.me.firstName}  ${userData.me.lastName}'s Equipment.`
                : "You have not saved any equipment yet." }
            </h1>
            <div className="align-self-center userEquipment">
                {userData.me.savedEquipment.map((item, i) => {
                    return (
                        <ul key={i}>
                            <li>Category: {item.category}</li>
                            <li>Brand: {item.brand}</li>
                            <li>Model: {item.model}</li>
                            <li>Description: {item.description}</li>
                            <li>Serial Number:  {item.serialNumber}</li>
                            <li>                      
                            {item.image.map((singleImage, j) => {
                                console.log(singleImage)
                                return (
                                    <CloudinaryContext cloudName="dgeknrish" key={j}>
                                        <Image publicId={singleImage}>
                                           <Transformation width="200" crop="scale"/>
                                        </Image>
                                    </CloudinaryContext> 
                                )
                            })}
                            </li>
                            <li>{item.lost? `Your item has been reported lost.` : `You have this item.`}</li>
                        </ul>
                    )
                })}
            </div>
        </div>
    )
}

export default SavedEquipment;