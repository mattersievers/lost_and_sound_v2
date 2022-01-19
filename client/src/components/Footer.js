import React, {useEffect} from "react";
import { loadStripe } from '@stripe/stripe-js';
import Auth from '../utils/auth';
import { useLazyQuery } from '@apollo/client';
import { DONATE } from '../utils/queries'

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

function Footer() {
    const [getDonation, { data }] = useLazyQuery(DONATE);

    const submitDonation = (event) =>{
        event.preventDefault();
        const getAmount = event.target.donation.value;
        console.log(parseInt(getAmount))
        getDonation({
            variables: {amount: parseInt(getAmount)}
        });
    }
      
    useEffect( () => {
        if(data) {
            stripePromise.then( (res) => {
                res.redirectToCheckout({ sessionId: data.donate.session });
            });
        }
    }, [data]);
   
    return(
        <form onSubmit={submitDonation} className="footer">
            {
                Auth.loggedIn() ?
                    <div  className="d-flex justify-content-center bg-dark">
                        <label htmlFor="donation">Help us maintain the site: </label>
                        <input name="donation" type="number" id="donation" />
                        <button type="submit">
                            Donate
                        </button>
                    </div>
                    :
                    <div className="d-flex flex-column align-items-center bg-dark">
                        <span>Create an account and start keeping your gear safe today for free! </span>
                        <span>We only attach strings to instruments, not our website.</span>
                        <span>If you would like to make a voluntary donation, please log in.</span>
                    </div>
                                }
        </form>
    )
}

export default Footer;