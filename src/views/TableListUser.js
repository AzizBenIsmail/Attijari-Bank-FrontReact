import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Media,
  Row,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Col,
} from "reactstrap";
import { getUsers, deleteUser, downgrade, upgrade } from "../Service/apiUser";
import Cookies from "js-cookie";
import moment from "moment";
import { FaUserAltSlash, FaUserCog } from "react-icons/fa";
import { GiUpgrade } from "react-icons/gi";
import { AiOutlineCloseCircle } from "react-icons/ai";
function TableListUser() {
  //session
  if (!Cookies.get("jwt_token")) {
    window.location.replace("/login-page");
  }

  const getAllUsers = useCallback(async (config) => {
    await getUsers(config)
      .then((res) => {
        setUsers(res.data.users);
        console.log(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const jwt_token = Cookies.get("jwt_token");

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    };
  }, [jwt_token]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers(config);

    const interval = setInterval(() => {
      getAllUsers(config);
    }, 60000);

    return () => clearInterval(interval);
  }, [getAllUsers, config]);

  const deleteAuser = async (user, config) => {
    const result = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ? " + user.username + "?"
    );
    if (result) {
      //console.log(user);
      deleteUser(user._id, config);
      getAllUsers(config);
    }
  };

  const upgradeAuser = async (user, config) => {
    upgrade(user._id, config);
    setTimeout(() => {
      getAllUsers(config);
    }, 1000); // Appeler getAllUsers(config) après un délai de 2 secondes
  };

  const downgradeAuser = async (user, config) => {
    downgrade(user._id, config);
    setTimeout(() => {
      getAllUsers(config);
    }, 1000); // Appeler getAllUsers(config) après un délai de 2 secondes
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Liste des utilisateur </CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Image</th>
                      <th>Surnom</th>
                      <th>Nom</th>
                      <th>Prenom</th>
                      <th>email</th>
                      <th>cree_At</th>
                      <th>modifier_AT</th>
                      <th>Role</th>
                      <th>verificarion</th>
                      <th>numero telephone</th>
                      <th>action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <Media className="align-items-center">
                          <a href="#pablo" onClick={(e) => e.preventDefault()}>
                            <img
                              alt="..."
                              src={`http://localhost:5000/images/${user.image_user}`}
                              style={{ width: "80px", height: "80px" }}
                            />
                          </a>
                        </Media>
                        <td>
                          {user.username ? (
                            user.username
                          ) : (
                            <AiOutlineCloseCircle className="mr-2" />
                          )}
                        </td>
                        <td>
                          {user.first_Name ? (
                            user.first_Name
                          ) : (
                            <AiOutlineCloseCircle className="mr-2" />
                          )}
                        </td>
                        <td>
                          {user.last_Name ? (
                            user.last_Name
                          ) : (
                            <AiOutlineCloseCircle className="mr-2" />
                          )}
                        </td>
                        <td>{user.email}</td>
                        <td>
                          {moment(user.createdAt).format("YYYY-MM-DD HH:mm")}
                        </td>
                        <td>
                          {moment(user.updatedAt).format("YYYY-MM-DD HH:mm")}
                        </td>
                        <td>{user.userType}</td>
                        <td>{user.enabled ? "Active" : "N/A"}</td>
                        <td>{user.phoneNumber}</td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem
                                href=""
                                onClick={(e) => deleteAuser(user, config)}
                              >
                                <FaUserAltSlash
                                  className=" mr-2"
                                  style={{ fontSize: "20px" }}
                                />
                                Supprimer
                              </DropdownItem>
                              <DropdownItem
                                href=""
                                // onClick={(e) => Modifier(user)}
                              >
                                <FaUserCog
                                  className=" mr-2"
                                  style={{ fontSize: "20px" }}
                                />
                                Modifier
                              </DropdownItem>
                              <DropdownItem
                                href=""
                                onClick={(e) => upgradeAuser(user, config)}
                              >
                                <GiUpgrade
                                  className=" mr-2"
                                  style={{ fontSize: "20px" }}
                                />
                                mise à niveau vers administrateur
                              </DropdownItem>
                              <DropdownItem
                                href=""
                                onClick={(e) => downgradeAuser(user, config)}
                              >
                                <GiUpgrade
                                  className=" mr-2"
                                  style={{ fontSize: "20px" }}
                                />
                                mise à niveau vers un simple utilisateur
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default TableListUser;