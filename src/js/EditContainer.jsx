import React from 'react';
import axios from 'axios';
import Card from './Container.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form';

export default class EditCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {},
      mode: "laptop",
      loading: true,
      publishing: false,
      uiSchemaJSON: {},
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined,
      refLinkDetails: undefined
    }
    this.refLinkSourcesURL = window.ref_link_sources_url;
    this.toggleMode = this.toggleMode.bind(this);
  }

  exportData() {
    let data = this.state.dataJSON;
    let getDataObj = {
      step: this.state.step,
      dataJSON: data,
      schemaJSON: this.state.schemaJSON,
      uiSchemaJSON: this.state.uiSchemaJSON,
      optionalConfigJSON: this.state.dataJSON.configs,
      optionalConfigSchemaJSON: this.state.optionalConfigSchemaJSON
    }
    getDataObj["name"] = getDataObj.dataJSON.data.headline.substr(0,225); // Reduces the name to ensure the slug does not get too long
    return getDataObj;
  }

  componentDidMount() {
    if (typeof this.props.dataURL === "string"){
      console.log(this.props);
      axios.all([
        axios.get(this.props.dataURL),
        axios.get(this.props.schemaURL),
        axios.get(this.props.optionalConfigURL),
        axios.get(this.props.optionalConfigSchemaURL),
        axios.get(this.props.uiSchemaURL),
        axios.get(this.props.siteConfigURL)
      ]).then(axios.spread((card, schema, opt_config, opt_config_schema, uiSchema, site_configs) => {
        console.log(card.data, schema.data, opt_config.data, opt_config_schema.data, uiSchema.data, site_configs.data)
          let formData = card.data,
            stateVar;
               
          stateVar = {
            dataJSON:  formData,
            schemaJSON: schema.data,
            uiSchemaJSON: uiSchema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data,
            siteConfigs: site_configs.data
          }
          stateVar.dataJSON.data.language = stateVar.siteConfigs.primary_language.toLowerCase();
          this.setState(stateVar);
        }))
        .catch((error) => {
          console.error(error);
          this.setState({
            errorOnFetchingData: true
          })
        });
    }
  }

  onChangeHandler({formData}) {
    switch (this.state.step) {
      case 1:

        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          dataJSON = formData;
          return {
            dataJSON: dataJSON
          }
        })
        break;
    }
  }

  onSubmitHandler({formData}) {
    switch(this.state.step) {
      case 1:
        if (typeof this.props.onPublishCallback === "function") {
          this.setState({ publishing: true });
          let publishCallback = this.props.onPublishCallback();
          publishCallback.then((message) => {
            this.setState({ publishing: false });
          });
        }
        break;
    }
  }

  renderSEO() {
    let data = this.state.dataJSON.data,
      seo_blockquote;
    seo_blockquote = `<blockquote><a href=${data.url} rel="nofollow">${data.headline ? `<h2>${data.headline}</h2>` : ""}</a>${data.byline ? `<p>${data.byline}</p>` : ""}${data.publishedat ? `<p>${data.publishedat}</p>` : ""}${data.series ? `<p>${data.series}</p>` : ""}${data.genre ? `<p>${data.genre}</p>` : ""}${data.subgenre ? `<p>${data.subgenre}</p>` : ""}${data.summary ? `<p>${data.summary}</p>` : ""}</blockquote>`;
    return seo_blockquote;
  }


  renderSchemaJSON() {
    switch(this.state.step){
      case 1:
        return this.state.schemaJSON;
        break;
      case 2:
        return this.state.optionalConfigSchemaJSON;
        break;
    }
  }

  renderFormData() {
    switch(this.state.step) {
      case 1:
        return this.state.dataJSON;
        break;
      case 2:
        return this.state.dataJSON.configs;
        break;
    }
  }

  showLinkText() {
    switch(this.state.step) {
      case 1:
        return '';
        break;
      case 2:
        return '< Back';
        break;
    }
  }

  showButtonText() {
    switch(this.state.step) {
      case 1:
        return 'Publish';
        break;
    }
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    });
  }

  toggleMode(e) {
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');
    this.setState((prevState, props) => {
      return {
        mode: "blank"
      }
    }, (() => {
          this.setState((prevState, props) => {
            let newMode;
            if (mode !== prevState.mode) {
              newMode = mode;
            } else {
              newMode = prevState.mode
            }
            return {
              mode: newMode
            }
          })
        }))
  }

  render() {
    if (this.state.schemaJSON === undefined) {
      return(<div>Loading</div>)
    } else {
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form protograph-scroll-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                    toCard
                  </div>
                </div>
                <JSONSchemaForm
                  uiSchema={this.state.uiSchemaJSON}
                  schema={this.renderSchemaJSON()}
                  onSubmit={((e) => this.onSubmitHandler(e))}
                  onChange={((e) => this.onChangeHandler(e))}
                  formData={this.renderFormData()}
                  >
                  <a id="protograph-prev-link" className={`${this.state.publishing ? 'protograph-disable' : ''}`} onClick={((e) => this.onPrevHandler(e))}>{this.showLinkText()} </a>
                  <button type="submit" className={`${this.state.publishing ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}>{this.showButtonText()}</button>
                </JSONSchemaForm>
              </div>
              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'laptop' ? 'active' : ''}`}
                      data-mode='laptop'
                      onClick={this.toggleMode}
                    >
                      Laptop
                    </a>
                  </div>
                </div>
                {
                  this.state.mode == "blank" ? <div /> : <div className="protograph-app-holder">
                    <Card
                      mode={this.state.mode}
                      dataJSON={this.state.dataJSON}
                      domain={this.props.domain}
                      optionalConfigJSON={this.state.optionalConfigJSON}
                      linkDetails={this.state.refLinkDetails}
                    />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}