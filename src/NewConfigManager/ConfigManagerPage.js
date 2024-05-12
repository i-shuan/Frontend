import React, { useState, useEffect } from "react";
import { List, Skeleton, Avatar, Card, Collapse} from 'antd';
import "./ConfigManagerPage.css";

const { Panel } = Collapse;

const data = [
    {
        key: '1-1',
        label: 'TAPParameters',
        name: 'TAPParameters',
        level: "SMP",
        value: null,
        type: null,
        description:"For TAPParameters",
        attributes: {},
        children: [
            {
                key: '1-1-1',
                label: 'BrakeFunction',
                name: 'BrakeFunction',
                level: "SMP",
                value: null,
                type: null,
                description:"For BrakeFunction"
            },
            {
                key: '1-1-2',
                label: 'enable',
                name: 'BrakeFunction.@enable',
                level: "SMP",
                value: null,
                type: null,
                description:"For enable",
            },
            {
                key: '1-1-3',
                label: 'WaferUnitCountingScope',
                name: 'WaferUnitCountingScope',
                level: "SMP",
                value: null,
                type: null,
                description:"For WaferUnitCountingScope",
                attributes: { List: "[01-01]FUST01;[02-33]TRS11;[02-34]TRS12" },
            },
            {
                key: '1-1-3',
                label: 'WaferUpdateEvent',
                name: 'WaferUpdateEvent',
                level: "SMP",
                value: null,
                type: null,
                description:"For WaferUpdateEvent",
                attributes: { List: "811;167776257" },
            },
            {
                key: '1-1-4',
                label: 'Targets',
                name: 'Targets',
                value: null,
                level: "TOOL",
                type: null,
                description:"For Targets",
                attributes: {},
                children: [
                    {
                        key: '1-1-4-1',
                        label: 'Target',
                        name: 'Target',
                        value: null,
                        level: "TOOL",
                        type: null,
                        description:"For Target",
                        attributes: { LayerID: "12P*", DefaultWaferCountSpec: "46" },
                        children: [
                            {
                                key: '1-1-4-1-1',
                                label: 'SpecialRule',
                                name: 'SpecialRule',
                                value: null,
                                level: "TOOL",
                                type: null,
                                description:"For SpecialRule",
                                attributes: {
                                    Part: "THHR67G0017A-T2EAZP4AESL.001",
                                    WaferCountSpec: "46"
                                },
                            }
                        ],
                    },
                    {
                        key: '1-1-4-2',
                        label: 'Target',
                        name: 'Target',
                        value: null,
                        level: "TOOL",
                        type: null,
                        description:"For Target",
                        attributes: { LayerID: "12N*", DefaultWaferCountSpec: "18" },
                        children: [
                            {
                                key: '1-1-4-2-1',
                                label: 'SpecialRule',
                                name: 'SpecialRule',
                                value: null,
                                level: "TOOL",
                                type: null,
                                description:"For SpecialRule",
                                attributes: {
                                    Part: "THU59",
                                    WaferCountSpec: "16"
                                },
                            }
                        ],
                    },
                ],
            },
        ],
    },
    {
        key: '1-2',
        label: 'EFCCfgFileName',
        name: 'EFCCfgFileName',
        level: "SMP",
        type:"string",
        description:"For EFCCfgFileName",
        value: "EFC_LithiusFoup.xml",
        attributes: {},
    },
    {
        key: '3',
        label: 'BundleManifest',
        name: 'BundleManifest',
        level: "SMP",
        value: null,
        attributes: {},
        children: [
            {
                key: '3-1',
                label: 'Bundles',
                name: 'Bundles',
                level: "SMP",
                value: null,
                attributes: {},
                children: [
                    {
                        key: '3-1-1',
                        label: 'Bundle',
                        name: 'Bundle',
                        level: "SMP",
                        value: null,
                        attributes: {
                            "name": "PrepareForEarthquake",
                            "InitialState": "Active",
                            "Activator": "PrepareForEarthquake.Activator"
                        }
                    }
                ]
            }
        ]
    },
    {
        key: '1-3',
        label: 'ConfigurationSDEV',
        name: 'ConfigurationSDEV',
        level: "SMP",
        value: null,
        type: null,
        description:"For ConfigurationSDEV",
        attributes: {},
        children: [
            {
                key: '1-3-1',
                label: 'ARTMIS',
                name: 'ARTMIS',
                level: "TOOL",
                value: null,
                type: null,
                description:"For ARTMIS",
                attributes: {
                    "Subject": "ORBFRAMEMORK: F12RTM02_RTPMIS: RTPMIS: F12RTM02"
                }
            },
            {
                key: '1-3-2',
                label: 'RESS',
                name: 'RESS',
                level: "TOOL",
                value: null,
                type: null,
                description:"For RESS",
                attributes: {
                    "Subject": "ORBFRAMEMORK:ORBIX_RMS:RMS3:F12RMS01"
                }
            },
            {
                key: '1-3-3',
                label: 'CALM',
                name: 'CALM',
                level: "TOOL",
                value: null,
                type: null,
                description:"For CALM",
                attributes: {
                    "Subject": "ORBFRAMEMORK: ORBIX_ALM: ALM2: F12AMSe1"
                },
            },
            {
                key: '1-3-4',
                label: 'RTH',
                name: 'RTH',
                level: "TOOL",
                value: null,
                type: null,
                description:"For RTH",
                attributes: {
                    "Subject": "ORBFRAMEMORK: F12RTM82_RTM:RTM: F12RTH02"
                }
            },
            {
                key: '1-3-5',
                label: 'TAP',
                name: 'TAP',
                level: "TOOL",
                value: null,
                type: null,
                description:"For TAP",
                attributes: {
                    "Subject": "TRAIN_TAP",
                    "agntSubject": "TRAIN_MGMT_TAP"
                }
            },
        ]
    }
];



const NestedList = ({ items, level = 0 }) => {
  return (
    <List
      dataSource={items}
      renderItem={item => (
        <List.Item style={{ paddingLeft: `${level * 24}px` }}>
          <List.Item.Meta
            title={item.label}
            description={item.description}
          />
          {item.children && (
            <NestedList items={item.children} level={level + 1} />
          )}
        </List.Item>
      )}
    />
  );
};

const ConfigManager = () => {
  return (
    <Collapse accordion>
      {data.map(item => (
        <Panel header={item.label} key={item.key}>
          {item.children ? (
            <NestedList items={item.children} />
          ) : (
            <p>{item.description}</p>
          )}
        </Panel>
      ))}
    </Collapse>
  );
};

export default ConfigManager;
