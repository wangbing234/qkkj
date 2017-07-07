
const ConstUtil ={
    ACCESSES_DATA_HIVE:[{type:"select",isAllowed:false},
                            {type:"update",isAllowed:false},
                            {type:"create",isAllowed:false},
                        {type:"drop",isAllowed:false} ,
                        {type:"alter",isAllowed:false}
        //,
        //                {type:"index",isAllowed:true,hidden:true},
        //                {type:"lock",isAllowed:true,hidden:true}
                      ],
    ACCESSES_DATA_HBASE:[ {type:"read",isAllowed:false} ,
                        {type:"write",isAllowed:false},
                        {type:"create",isAllowed:false},
                        {type:"admin",isAllowed:false}
                      ],
    ACCESSES_DATA_HDFS:[
        {type:"read",isAllowed:false} ,
        {type:"write",isAllowed:false}
    ]
};

export default ConstUtil