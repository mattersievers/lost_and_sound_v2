//gets location from invisible map
import React, {useRef, useEffect} from 'react';
import{Marker, useMap}from 'react-leaflet';
function Location(props) {
    const {position, userData, setPosition, lostDistances, setLostDistances} = props;
    const markerRef = useRef(null);
    const map = useMap();
    if(position == null){
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
        });
    }    
        
    useEffect(()=> {
        if(userData && position) {
            userData.users.forEach(currentUser => 
                currentUser.savedEquipment.forEach(item => {
                    if(item.lost){
                        let itemLatLng = item.location.split(')').join(',').split('(').join(',').split(',')
                        let tempMile = map.distance(position,[itemLatLng[1],itemLatLng[2]])*0.000621;
                        let userEquipIndex = currentUser.email.concat(currentUser.savedEquipment.indexOf(item))
                        if(!lostDistances.some(el => el.userEquip === userEquipIndex)){                        
                            setLostDistances([...lostDistances,{userEquip: userEquipIndex, userEmail: currentUser.email, miles:tempMile}])
                        }
                    }
                })
            )
        }
    })
        
        console.log(lostDistances)
    
    return position === null ? null : (
        <Marker position={position} ref={markerRef}>
        </Marker>
    );
};

export default Location;