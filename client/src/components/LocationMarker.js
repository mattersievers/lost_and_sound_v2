import React, {useRef, useMemo, useEffect} from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';

// gets location of user and implements a draggable icon on the map
const LocationMarker = (props) => {
    const {setPosition, locationMarked, coordinate1, coordinate2, setLocationMarked} = props;
    const markerRef = useRef()
    const map = useMap();

    useEffect(()=> {
        if(!locationMarked){
            map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
            });
            setLocationMarked(true);
        } else if(coordinate1 && coordinate2){
            setPosition([coordinate1, coordinate2]);
            map.flyTo([coordinate1, coordinate2], map.getZoom());
        }    
    }, [locationMarked, map, setPosition, coordinate1, coordinate2, setLocationMarked]);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
            const marker = markerRef.current
            if (marker != null) {
                setPosition(marker.getLatLng())
            }
            },
        }),
        [setPosition],
        )

    return props.position === null ? null : (
        <Marker position={props.position} draggable autoPan eventHandlers={eventHandlers} ref={markerRef}>
            <Popup>
                <p className='leafletPopup'>The nearest location to where the equipment was lost or your current location.</p>
            </Popup>    
        </Marker>
    );
};

export default LocationMarker