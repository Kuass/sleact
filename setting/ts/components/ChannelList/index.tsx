import React, {FC, useCallback, useState} from "react";
import {IChannel, IUser} from "@typings/db";
import {useLocation, useParams} from "react-router";


interface Props {
  channelData?: IChannel[];
  userData?: IUser;
}

const ChannelList: FC<Props> = ({ userData, channelData }) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  // const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number | undefined }>({});

  const toggleChannelCollpase = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  return (
    <div>

    </div>
  );
}

export default ChannelList;
