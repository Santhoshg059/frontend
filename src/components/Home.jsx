import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import coins from "../images/coins2.png"
import homecontactimg from "../images/homecontactimg.png"
import handimg from "../images/handimage.png"
import scamimg from "../images/scamDetective.svg"
import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit';

function Home() {
    const navigate=useNavigate()
    const [showContent, setShowContent] = useState(false);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [personCount, setPersonCount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const check=()=>{
       navigate('/edit')
       setShowContent(true)
    }
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await fetch(`https://backend-1-1trx.onrender.com/search?from=${from}&to=${to}&date=${date}&personCount=${personCount}`);
          if (!response.ok) {
              throw new Error('Failed to fetch rides');
          }
          const data = await response.json();
          navigate('/searchride', { state: { rides: data } }); // Passing state to SearchRide component
      } catch (error) {
          console.error('Error searching for rides:', error);
      }
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
        // If selected date is in the past, set the date to the current date
        setDate(currentDate.toISOString().split('T')[0]);
    } else {
        // If selected date is in the present or future, update the state with the selected date
        setDate(e.target.value);
    }
};

  return <>
    <div className="mdiv">
                <div className="picturediv">
                {/* <img src={coins} className="homeimg card-img-top" alt="coins" /> */}
                    <form onSubmit={handleSubmit} className="input-group">
                    <input type="text" className="form-control" id="from" placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} />
<input type="text" className="form-control" id="To" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
<input type="date" className="form-control" id="datepicker" placeholder="Date" value={date} onChange={handleDateChange} />
<input type="number" className="form-control" id="personCount" min="1" placeholder="Enter count" value={personCount} onChange={(e) => setPersonCount(e.target.value)} />

                        <button type="submit" className="btn btn-primary"><b>Search Ride</b></button>
                    </form>
                </div>
                <div className="seconddiv">
                    <div className="scamimgdiv">
                        <div className="scamimg"><img src={scamimg} alt="" srcSet="" /></div>
                        <div className="scamtext"><h1>Help us keep you safe from scams</h1><br /><h5>At Comrade, we're working hard to make our platform as secure as it can be. But when scams do happen, we want you to know exactly how to avoid and report them. Follow our tips to help us keep you safe.</h5></div>
                    </div>
                    <div className="card-group">
                        <div className="card" >
                            <img src={coins} className="homeimg card-img-top" alt="coins" />
                            <div className="card-body">
                                <h5 className="card-title"><b>Money-Saving Strategies for Transportation</b></h5>
                                <p className="card-text">Booking transportation in advance often leads to better deals. This applies to flights, trains, and sometimes even ride-hailing services.</p>
                            </div>
                        </div>
                        <div id="card1" className="card">
                            <img src={homecontactimg} className="homeimg card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title"><b>Secure, Seamless Booking</b></h5>
                                <p className="card-text">We've designed a user-friendly platform that prioritizes your safety. From profile verifications to secure transactions, every step of your journey with us is carefully crafted to provide a seamless and secure booking experience.</p>
                            </div>
                        </div>
                        <div className="card">
                            <img src={handimg} className="homeimg card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title"><b>Effortless Navigation</b></h5>
                                <p className="card-text">Navigate through our intuitive interface effortlessly. Scroll through options, click to explore destinations, and tap to select your preferred travel arrangements. It's that easy to embark on your next adventure!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Import JavaScript files using script tags */}
            {/* <script src="script.js"></script>
            <src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossorigin="anonymous"></script> */}
             <MDBFooter className='bg-light text-center text-white'>
      <MDBContainer className='p-4 pb-0'>
        <section className='mb-4'>
          <MDBBtn
            floating
            className='m-1'
            style={{ backgroundColor: '#3b5998' }}
            href='#!'
            role='button'
          >
            <MDBIcon fab icon='facebook-f' />
          </MDBBtn>

          <MDBBtn
            floating
            className='m-1'
            style={{ backgroundColor: '#55acee' }}
            href='#!'
            role='button'
          >
            <MDBIcon fab icon='twitter' />
          </MDBBtn>

          <MDBBtn
            floating
            className='m-1'
            style={{ backgroundColor: '#dd4b39' }}
            href='#!'
            role='button'
          >
            <MDBIcon fab icon='google' />
          </MDBBtn>
          <MDBBtn
            floating
            className='m-1'
            style={{ backgroundColor: '#ac2bac' }}
            href='#!'
            role='button'
          >
            <MDBIcon fab icon='instagram' />
          </MDBBtn>

          <MDBBtn
            floating
            className='m-1'
            style={{ backgroundColor: '#0082ca' }}
            href='#!'
            role='button'
          >
            <MDBIcon fab icon='linkedin-in' />
          </MDBBtn>

          <MDBBtn
            floating
            className='m-1'
            style={{ backgroundColor: '#333333' }}
            href='#!'
            role='button'
          >
            <MDBIcon fab icon='github' />
          </MDBBtn>
        </section>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2023 Copyright:
        <a className='text-white' href='https://frontend-sage-one-40.vercel.app/'>
          Comrade.com
        </a>
      </div>
    </MDBFooter>
    </>
}

export default Home