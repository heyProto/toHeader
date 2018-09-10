import React from 'react';
import {render, hydrate} from 'react-dom';
import Card from './src/js/Container.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toCard = function () {
  this.cardType = 'toCard';
}

ProtoGraph.Card.toCard.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toCard.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toCard.prototype.renderSection= function (data) {
  this.mode = 'section';
  this.render();
}

ProtoGraph.Card.toCard.prototype.renderArticle= function (data) {
  this.mode = 'article';
  this.render();
}

ProtoGraph.Card.toCard.prototype.render = function () {
  if (this.options.isFromSSR){
    hydrate(
      <Card
        mode={this.mode}
        dataJSON={this.options.initialState.dataJSON}
      />,
      this.options.selector);
  } else {
    render(
      <Card
        dataURL={this.options.data_url}
        selector={this.options.selector}
        domain={this.options.domain}
        siteConfigURL={this.options.site_config_url}
        siteConfigs={this.options.site_configs}
        clickCallback={this.options.onClickCallback}
        mode={this.mode}
        ref={(e) => {
          this.containerInstance = this.containerInstance || e;
        }} />,
      this.options.selector);
  }
}