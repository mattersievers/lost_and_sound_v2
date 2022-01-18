import React from "react";
import { useQuery } from '@apollo/client';
import { GET_EQUIPMENT } from '../utils/queries';
import { CloudinaryContext, Transformation, Image } from 'cloudinary-react';



const LostEquipment = () => {
    const { loading, data: userData } = useQuery(GET_EQUIPMENT);
 
    if(loading) {
        return <h1> LOADING... </h1>
    }

    return(
        <div className="lostEquipmentContent mainContent">
            <h1>
                Welcome to Lost and Sound!
            </h1>
            <h2>
                Report and recover lost or stolen musical instruments and accessories.
            </h2>
            <div className="align-self-center userEquipment">
                {userData.users.map((user, i) => {
                    let link = `mailto: ${user.email}`
                    if(user.hasLost) {
                        return (
                            <div key={i}>
                                <div className="userName">
                                    {user.firstName} {user.lastName}
                                </div>
        
                                {user.savedEquipment.map((item, j) => {
                                    
                                    if (item.lost) {
                                        return(
                                            <div key={j}>
                                                <ul>
                                                    <li>
                                                    {item.image.map((singleImage, j) => {
                                                        return (
                                                            <CloudinaryContext cloudName="dgeknrish" key={j}>
                                                                <Image publicId={singleImage}>
                                                                <Transformation width="200" crop="scale"/>
                                                                </Image>
                                                            </CloudinaryContext> 
                                                        )
                                                    })}
                                                    </li>
                                                    <li>Category: {item.category}</li>
                                                    <li>Brand: {item.brand}</li>
                                                    <li>Model: {item.model}</li>
                                                    <li>Description: {item.description}</li>
                                                    <li>Serial Number:  {item.serialNumber}</li>
                                                </ul>
                                                <a href={link}>Contact the owner.</a>
                                            </div>    

                                        )
                                    }
                                })}
                            </div>
                        )
                    }
                    
                })}
            </div>
        </div>
    )
}

export default LostEquipment;