import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ElementsConsumer, CardElement , useStripe, useElements } from "@stripe/react-stripe-js";
import PaymentMethod1 from './PaymentMethod1.js';


const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#303238",
        fontSize: "16px",
        fontFamily: "sans-serif",
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#CFD7DF"
        }
      },
      invalid: {
        color: "#e5424d",
        ":focus": {
          color: "#303238"
        }
      }
    }
  };
  
const stripePromise = loadStripe('pk_test_7rF79g57po6HBEZMbqn1PVPw');

const InjectedCheckoutForm = () => {
    return (
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <CheckoutForm stripe={stripe} elements={elements} />
        )}
      </ElementsConsumer>
    );
  }
  

const CardSection = () => {

    return (
        <label>
      Card details
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </label>
    )
}

const CheckoutForm = () => {
    // const [clientSecret, setClientSecret] = useState(null);
    // const [succeeded, setSucceeded] = useState(false);
    const stripe = useStripe();
  const elements = useElements();

  
    const handleSubmit = async event => {
        event.preventDefault();
      
        // const { stripe, elements } = props;
        if (!stripe || !elements) {
          return;
        }
      
        const card = elements.getElement(CardElement);
        console.log(card, 'card')
        const result = await stripe.createToken(card, {
            
        });
        console.log(result, 'resultresult')
        if (result.error) {
          console.log(result.error.message);
        } else {
          console.log(result.token);
          // pass the token to your backend API
        }
      };
      
    return (
        <div>
        <div class="product-info">
          <h3 className="product-title">Apple MacBook Pro</h3>
          <h4 className="product-price">$999</h4>
        </div>
        <form onSubmit={handleSubmit}>
          <CardSection />
          <button className="btn-pay">Buy Now</button>
        </form>
      </div>
    );
  };
  



const PaymentMethod = () => {
  return (
    <div className="App">
      <div className="product">
        <img
          src="https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress"
          alt="laptop"
          style={{ width: "100%", height: "auto" }}
        />
        <div>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
};


export default PaymentMethod