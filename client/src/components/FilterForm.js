import React,{useState} from "react";

const FilterForm = (props) => {
    const handleFormSubmission = async(event) => {

    }

    return(
        <div className="filterFormElement">
            <h3>Filter by</h3>
            <form className="filterForm" onSubmit={handleFormSubmission()}>
                <label for="distance">Distance: </label>
                <select id="distance" name="distance">
                    <option value="4000">Any</option>
                    <option value="300">300 miles</option>
                    <option value="200">200 miles</option>
                    <option value="100">100 miles</option>
                    <option value="50">50 miles</option>
                    <option value="25">25 miles</option>
                </select>
                <button type="submit">Submit</button>
            </form>
        </div>    
    )

}

export default FilterForm