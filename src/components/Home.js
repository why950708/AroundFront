import React from 'react';
import {Tabs, Spin, Button} from 'antd';
import  {GEO_OPTIONS, POS_KEY} from '../constants'

const TabPane = Tabs.TabPane;
export class Home extends React.Component {
    state = {
        loadingGeoLocation: false,

    }
    componentDidMount() {
        if ("geolocation" in navigator) {
            this.setState({loadingGeoLocation:true});
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS,
            );
        } else {
            console.log("geo location not supported");
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        this.setState({loadingGeoLocation:false});
        const {latitude: lat, longitude: lon} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: lat, lon:lon}));
        console.log(position);
    }

    onFailedLoadGeoLocation = () => {
        this.setState({loadingGeoLocation:true});
    }

    getGalleryPanelContent = () => {
        if (this.state.loadingGeoLocation) {
            // Show spinner
            return <Spin tip="Loading geo location ..." size={"large"}/>
        }
        return;
    }


    render() {

        //const createPostButton = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;
        return (
            <Tabs
                onChange={this.onTabChange}
                //tabBarExtraContent={createPostButton}
                className="main-tabs"
            >
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}
                </TabPane>
                <TabPane tab="Map" key="2">
                    Content Of Tab 2
                </TabPane>
            </Tabs>
        );

    }
}
