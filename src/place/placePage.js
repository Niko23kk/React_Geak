import React from "react";
import "../css/catalogItem.css";
import "../css/adaptive.css";
import { StaticValue } from "../staticValue";
import { useParams } from "react-router-dom";
import { Comment } from "../comment";
import { canCoinUpdate } from "..";
import { AddCoinCounter } from "../reducer/coinsReducer";

export function PlacePageGetParams() {
  let { id } = useParams();

  return <PlacePage id={id} />;
}

export class PlacePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      photos: [],
      isLoadedPlace: false,
      isLoadedPhotos: false,
    };
  }

  componentDidMount() {
    fetch(`${StaticValue.BaseURL}/api/place/${this.props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.token,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        if (res.status === 401) {
          window.location.href = "/notAuthorize";
        }
        if (res.status === 403) {
          window.location.href = "/notAccess";
        }
        if (res.status === 404 || res.status === 400) {
          window.location.href = "/notFound";
        }
        if (res.status === 500) {
          window.location.href = "/internalServerError";
        }
      })
      .then(
        (result) => {
          this.setState({
            isLoadedPlace: true,
            product: result,
          });
        },
        (error) => {
          this.setState({
            isLoadedPlace: true,
            error,
          });
        }
      );
  }

  render() {
    if (this.state.isLoadedPlace) {
      return (
        <div className="product-page-container">
          {" "}
          {canCoinUpdate ? (
            <AddCoinCounter value={4}> </AddCoinCounter>
          ) : (
            <></>
          )}{" "}
          <div className="product-page-info-container">
            <div className="product-page-photo">
              <div className="place-page-main-photo">
                {this.state.product.photo.includes("http") ? (
                  <img
                    src={this.state.product.photo}
                    alt="description of image"
                  />
                ) : (
                  <img
                    src={StaticValue.BaseURL + this.state.product.photo}
                    alt="description of image"
                  />
                )}
              </div>{" "}
            </div>{" "}
            <div className="product-page-info">
              <h1> {this.state.product.name} </h1>{" "}
              <div> {this.state.product.description} </div>{" "}
              <div className="product-page-more-info">
                <div className="product-property-map-place">
                  <div className="product-property-title"> Адрес </div>{" "}
                  <div className="product-value">
                    {" "}
                    {this.state.product.mapPlace}{" "}
                    <div class="mapouter">
                      <div class="gmap_canvas">
                        <iframe
                          width="600"
                          height="500"
                          id="gmap_canvas"
                          src={`https://maps.google.com/maps?q=${this.state.product.mapPlace}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                          frameborder="0"
                          scrolling="no"
                          marginheight="0"
                          marginwidth="0"
                        ></iframe>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <Comment id={this.props.id} />{" "}
        </div>
      );
    } else {
      return "";
    }
  }
}
