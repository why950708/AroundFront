import React from 'react';
import {Tabs, Spin} from 'antd';
import $ from 'jquery';
import {Gallery} from "./Gallery"
import {CreatePostButton} from "./CreatePostButton"
import {API_ROOT, AUTH_PREFIX, GEO_OPTIONS, POS_KEY, TOKEN_KEY} from '../constants'


const TabPane = Tabs.TabPane;


export class Home extends React.Component {
    state = {
        posts:[],
        error : '',
        loadingGeoLocation: false,
        loadingPosts: false,
    }
    onTabChange = (key) => {
        console.log(key);
    }

    componentDidMount() {
        if ("geolocation" in navigator) {
            this.setState({loadingGeoLocation:true, error:''});
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS,
            );
        } else {
            this.setState({error : "geo location not supported"});
            //const {lat, lon} = {"lat":37.5629917, "lon":-122.3255253999999}

        }
    }

    onSuccessLoadGeoLocation = (position) => {
        this.setState({loadingGeoLocation:false, error:''});
        const {latitude: lat, longitude: lon} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: lat, lon:lon}));
        console.log(position);
        this.loadNearbyPosts();
    }

    onFailedLoadGeoLocation = (error) => {
        this.setState({loadingGeoLocation:false, error: "Failed to load Geo location!"});
    }

    getGalleryPanelContent = () => {
            if (this.state.error) {
                return <div>{this.state.error}</div>
             }
        else if (this.state.loadingGeoLocation) {
            // Show spinner
            return <Spin tip="Loading geo location ..." size={"large"}/>
        } else if (this.state.loadingPosts) {
                // Show spinner
                return <Spin tip="Loading posts ..." size={"large"}/>
            } else if (this.state.posts) {
                // Show gallery
                const images = this.state.posts.map((post) => {
                    return {
                        user: post.user,
                        src: post.url,
                        thumbnail: post.url,
                        thumbnailWidth: 400,
                        thumbnailHeight: 300,
                        caption: post.message,
                    };

                });
                console.log(images);
                return (<Gallery images={images}/>);
            }
        return null;
    }

    loadNearbyPosts = () => {
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        this.setState({ loadingPosts: true });
        return $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
            },
        }).then((response) => {
            this.setState({ posts: response, error: '' });
            console.log(response);
        }, (error) => {
            this.setState({ error: error.responseText });
        }).then(() => {
            this.setState({ loadingPosts: false });
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const createPostButton = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;
        return (
            <Tabs
                onChange={this.onTabChange}
                tabBarExtraContent={createPostButton}
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
