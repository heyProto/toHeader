import React from 'react';
import axios from 'axios';

export default class toCard extends React.Component {
  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      domain: undefined
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.data.language);
    }

    if(this.props.domain){
      stateVar.domain = this.props.domain;
    }

    if (this.props.siteConfigs) {
      stateVar.siteConfigs = this.props.siteConfigs;
    }

    this.state = stateVar;
    this.handleClick = this.handleClick.bind(this);
  }


  componentDidMount() {
    if (this.state.fetchingData){
      let items_to_fetch = [
        axios.get(this.props.dataURL)
      ];
      if (this.props.siteConfigURL) {
        items_to_fetch.push(axios.get(this.props.siteConfigURL));
      }
      console.log(this.props)
      axios.all(items_to_fetch).then(axios.spread((card, site_configs) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data,
          optionalConfigJSON: {}
        };
        site_configs ? stateVar["siteConfigs"] = site_configs.data : stateVar["siteConfigs"] =  this.state.siteConfigs;
        stateVar.languageTexts = this.getLanguageTexts(stateVar.siteConfigs.primary_language.toLowerCase());
        this.setState(stateVar);
      }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  checkURL(url){
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (!re.test(url)) {
        return false;
    }
    return true;
  }

  handleClick(){
    window.open(this.state.dataJSON.data.url,'_top');
  }

  renderHTML() {
    if (this.state.fetchingData) {
      return (
        <div></div>
      )
    } else {
      let data = this.state.dataJSON.data,
          remain = data.options &&  JSON.parse(JSON.stringify(data.options)),
          slice = 5;
      let options = remain && remain.splice(0,slice);
      console.log(data);
      return (
        <div className="pro-header">
          <div className="pro-verticals-black-bar">
            <div className="pro-container">
              {
                data.verticals && data.verticals.map((v,i)=>{
                  return(
                    <a key={`vertical-${i}`} href={v.link}>{v.text}</a>
                  )
                })
              }
            </div>
          </div>
          <div className="pro-mobile-publisher-name-black-bar">
            <div className="pro-container">
              {data.brand && <a href={data.brand.brand_link}>{data.brand.brand_name}</a>}
            </div>
          </div>
          <div className="pro-publisher-masthead">
            <div className="pro-container">
              <div className="pro-masthead-ad"></div>
              {data.brand && <a href={data.brand.brand_link}><img src={data.brand.brand_image}></img></a>}
            </div>
          </div>
          <div className="pro-container">
            <div className="pro-menubar">
              {data.project_image && <div className="project-name-icon"><img src={data.project_image} height="24px"></img></div>}
              {data.social && data.social.fb_link && <div className="social-icon"><a href={data.social.fb_link}><img src="https://utils.pro.to/lib/fb-black-icon.png" height="30px"></img></a></div>}
              {data.social && data.social.twitter_link && <div className="social-icon"><a href={data.social.twitter_link}><img src="https://utils.pro.to/lib/twitter-black-icon.png" height="30px"></img></a></div>}
              {data.social && data.social.youtube_link && <div className="social-icon"><a href={data.social.youtube_link}><img src="https://utils.pro.to/lib/youtube-black-icon.png" height="30px"></img></a></div>}
              <div className="menu-options">
                {options && options.map((o,i)=>{
                  return(
                    <a key={`option-${i}`} href={o.link}>{o.text}</a>
                  )
                })}
                <a href="" className="more-option">More <img src="https://utils.pro.to/lib/down-arrow-black-icon.png"></img></a>
              </div>
            </div>
          </div>
          <div className="pro-mobile-menubar">
            <div className="mobile-menubar-project-info">
              <div className="project-name-icon"><img src={data.project_image} height="24px"></img></div>
            </div>
            <div className="menu-options">
              {
                options && options.map((o,i)=>{
                  return(
                    <a key={`optionmob-${i}`} href={o.link}>{o.text}</a>
                  )
                })
              }
              <a href="" className="more-option">More <img src="down-arrow-icon.png"></img></a>
            </div>
          </div>
          <div className="pro-project-dropdown">
        
          </div>
        </div>
      );
    }
  }

  getLanguageTexts(languageConfig) {
    let language = languageConfig ? languageConfig : "hindi",
      text_obj;

    switch(language.toLowerCase()) {
      case "hindi":
        text_obj = {
          font: "'Sarala', sans-serif"
        }
        break;
      default:
        text_obj = {
          font: undefined
        }
        break;
    }
    return text_obj;
  }

  render() {
    switch(this.props.mode) {
      default:
        return this.renderHTML();
    }
  }
}