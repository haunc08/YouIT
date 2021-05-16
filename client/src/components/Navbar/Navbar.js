import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
  Layout,
  Typography,
  Row,
  Input,
  Menu,
  Dropdown,
  Avatar,
  List,
  Badge,
  Button,
} from "antd";
import styles from "./styles";
import {
  SearchOutlined,
  BellFilled,
  EditFilled,
  MessageFilled,
  LogoutOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/auth";
import COLOR from "../../constants/colors";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useToken } from "../../context/TokenContext";
import { useCuteClientIO } from "../../socket/CuteClientIOProvider";

import {
  getUserNotifications,
  addUserNotifications,
  refreshNotifications,
} from "../../redux/actions/notifications";
import NotificationList from "./NotificationList/NotificationList";

const { Header } = Layout;
const { Text } = Typography;

function Navbar({ selectedMenu, setTxtSearch }) {
  // const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [user, setUser] = useLocalStorage("user");
  const [token, setToken] = useToken();
  const inputRef = useRef();

  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const cuteIO = useCuteClientIO();

  const notifications = useSelector((state) => state.notifications);

  //#region notification handle

  const handleClickNotificationItem = (url) => {
    history.push(url);
  };

  useEffect(() => {
    if (user) {
      dispatch(getUserNotifications());
    }
  }, [user, dispatch]);

  useEffect(() => {
    const listener = (event, msg) => {
      if (event.indexOf("Notification") === 0)
        dispatch(addUserNotifications(msg)); // add noti to it
    };
    cuteIO.onReceiveAny(listener);

    return () => {
      cuteIO.stopReceiveAny(listener);
    };
  }, [cuteIO]);

  //#endregion

  const handleSearch = () => {
    if (setTxtSearch !== undefined) setTxtSearch(inputRef.current.state.value);
    history.push("/search");
  };

  const handlePost = () => {
    history.push("/post/create");
  };

  const handleMessage = () => alert("handle message");

  //#region menuMore
  const handleLogOut = async () => {
    await dispatch(logout(setUser, token, setToken));
    await dispatch(refreshNotifications());
    history.push("/login");
  };

  const menuMore = (
    <Menu>
      <Menu.Item key="logout" onClick={() => handleLogOut()}>
        <Row align="middle">
          <LogoutOutlined className=" red mr-2" />
          <Text>Logout</Text>
        </Row>
      </Menu.Item>
    </Menu>
  );

  //#endregion

  // useEffect(() => {
  //   const token = user?.token;

  //   if (token) {
  //     const decodedToken = decode(token);

  //     if (decodedToken.exp * 1000 < new Date().getTime()) {
  //       dispatch(logout(setUser, setToken));
  //     }
  //   }

  //   setUser(JSON.parse(localStorage.getItem("user")));
  // }, [location]);

  return (
    <Header
      style={{
        ...styles.greenBackground,
        ...styles.fixedHeader,
      }}
    >
      <Row className="align-items-center justify-content-around">
        <div style={styles.logo}>
          <Link to="/">
            <Text style={styles.title}>YouIT</Text>
          </Link>
        </div>

        <Input
          onPressEnter={handleSearch}
          allowClear
          suffix={
            <SearchOutlined
              onClick={handleSearch}
              style={{ fontSize: 24, color: COLOR.white }}
            />
          }
          ref={inputRef}
          bordered={false}
          style={{ backgroundColor: COLOR.lightGreen, width: "40vw" }}
        />

        {user ? (
          <>
            <Dropdown
              overlay={NotificationList({
                handleClickNotificationItem,
                notifications,
              })}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Badge count={notifications.length} showZero>
                <BellFilled
                  className="clickable"
                  // onClick={handleNoti}
                  style={{ fontSize: 24, color: COLOR.white }}
                />
              </Badge>
            </Dropdown>

            <EditFilled
              onClick={handlePost}
              style={{ fontSize: 24, color: COLOR.white }}
            />
            <MessageFilled
              onClick={handleMessage}
              style={{ fontSize: 24, color: COLOR.white }}
            />

            <Avatar
              size="large"
              alt={user?.result?.name}
              src={user?.result?.imageUrl}
            >
              <Link
                to={`/userinfo/${user?.result._id}`}
                style={{ color: COLOR.white }}
              >
                {user?.result?.name}
              </Link>
            </Avatar>

            <Dropdown
              overlay={menuMore}
              trigger={["click"]}
              placement="bottomCenter"
            >
              <EllipsisOutlined style={{ fontSize: 24, color: COLOR.white }} />
            </Dropdown>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/register">
              <Button>Regiter</Button>
            </Link>
          </>
        )}
      </Row>
      {/* <Menu
        style={styles.greenBackground}
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[selectedMenu]}
      >
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="feed">
          <Link to="/feed">Feed</Link>
        </Menu.Item>
        {user ? (
          <>
            <div style={styles.right}>
              <Text className="text-white">{user.result.name}</Text>
              <Avatar
                className="mx-2"
                alt={user.result.name}
                src={user.result.imageUrl}
              >
                {user.result.name.charAt(0)}
              </Avatar>
              <Button>
                <Link to="/" onClick={handleLogOut}>
                  Logout
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <Menu.Item key="auth">
            <Link to="/auth">Sign In</Link>
          </Menu.Item>
        )}
        <Menu.Item key="test">
          <Link to="/posts/60821adcd9bd84174cecee9f">A post</Link>
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Link to="/userinfo">User Info</Link>
        </Menu.Item>

        <Menu.Item key="createPost">
          <Link to="/post/create">Create post</Link>
        </Menu.Item>
      </Menu> */}
    </Header>
  );
}

export default Navbar;
