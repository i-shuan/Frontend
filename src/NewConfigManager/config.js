const data = [
    {
        key: '1',
        label: 'TAPParameters',
        name: 'TAPParameters',
        level: "SMP",
        value: null,
        type: null,
        description:"For TAPParameters",
        attributes: {},
        children: [
            {
                key: '1-1',
                label: 'BrakeFunction',
                name: 'TAPParameters.BrakeFunction',
                level: "SMP",
                value: null,
                type: null,
                description:"For BrakeFunction",
                children: [
                    {
                        key: '1-1-1',
                        label: 'enable',
                        name: 'TAPParameters.BrakeFunction.@enable',
                        level: "SMP",
                        value: null,
                        type: null,
                        description:"For enable",
                    },
                    {
                        key: '1-1-2',
                        label: 'WaferUnitCountingScope',
                        name: 'TAPParameters.BrakeFunction.WaferUnitCountingScope',
                        level: "SMP",
                        value: null,
                        type: null,
                        description:"For WaferUnitCountingScope",
                        children: [
                            {
                                key: '1-1-2-1',
                                label: 'List',
                                name: 'TAPParameters.BrakeFunction.WaferUnitCountingScope.@List',
                                level: "SMP",
                                value: "[01-01]FUST01;[02-33]TRS11;[02-34]TRS12",
                                type: "string",
                                description:"For WaferUnitCountingScope"
                            }
                        ]
                    },
                    {
                        key: '1-1-3',
                        label: 'WaferUpdateEvent',
                        name: 'TAPParameters.BrakeFunction.WaferUpdateEvent',
                        level: "SMP",
                        value: null,
                        type: null,
                        description:"For WaferUpdateEvent",
                        children: [
                            {
                                key: '1-1-3-1',
                                label: 'List',
                                name: 'TAPParameters.BrakeFunction.WaferUpdateEvent.@List',
                                level: "SMP",
                                value: "811;167776257",
                                type: "string",
                                description:"For WaferUnitCountingScope"
                            }
                        ]
                    },
                    {
                        key: '1-1-4',
                        label: 'Targets',
                        name: 'TAPParameters.BrakeFunction.Targets',
                        value: null,
                        level: "TOOL",
                        type: null,
                        description:"For Targets",
                        children: [
                            {
                                key: '1-1-4-1',
                                label: 'Target',
                                name: 'TAPParameters.BrakeFunction.Targets.Target',
                                value: null,
                                level: "TOOL",
                                type: null,
                                description:"For Target",
                                attributes: { LayerID: "12P*", DefaultWaferCountSpec: "46" },
                                children: [
                                    {
                                        key: '1-1-4-1-1',
                                        label: 'LayerID',
                                        name: 'TAPParameters.BrakeFunction.Targets.Target.@LayerID',
                                        value: "12P*",
                                        level: "TOOL",
                                        type: "string",
                                        description:"For LayerID"
                                    },
                                    {
                                        key: '1-1-4-1-2',
                                        label: 'DefaultWaferCountSpec',
                                        name: 'TAPParameters.BrakeFunction.Targets.Target.@DefaultWaferCountSpec',
                                        value: "46",
                                        level: "TOOL",
                                        type: "string",
                                        description:"For DefaultWaferCountSpec"
                                    },
                                    {
                                        key: '1-1-4-1-3',
                                        label: 'SpecialRule',
                                        name: 'TAPParameters.BrakeFunction.Targets.Target.SpecialRule',
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
                                key: '1-4-2',
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
                 
                ]
            }
        ]       
    },
    {
        key: '2',
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
        key: '4',
        label: 'ConfigurationSDEV',
        name: 'ConfigurationSDEV',
        level: "SMP",
        value: null,
        type: null,
        description:"For ConfigurationSDEV",
        attributes: {},
        children: [
            {
                key: '4-1',
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
                key: '4-2',
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
                key: '4-3',
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
                key: '4-4',
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
                key: '4-5',
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