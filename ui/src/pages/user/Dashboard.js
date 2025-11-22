import Container from "../../components/ui/Container";
import Content from "../../components/ui/Content";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../constants";
import DashboardListItem from "../../components/dashboard/DashboardListItem";
import styles from "./Dashboard.module.css";
import {
  BorderAll,
  Film,
  PeopleFill,
  PersonVcardFill,
  ProjectorFill,
  QrCodeScan,
  TagFill,
  TicketFill,
  BarChartFill,
} from "react-bootstrap-icons";

const Dashboard = (props) => {
  const { user } = useAuth();

  return (
    <Container style={{minHeight: "75vh"}}>
      <Content className={styles.content}>
        <h1>Bảng điều khiển</h1>
        {user && (
          <>
            <h4>
              Chào mừng, {user.firstName} {user.lastName}!
            </h4>

            <div className="d-flex flex-column gap-2 mb-3 mt-5">
              {user.role === ROLES.ADMIN && (
                <>
                  <DashboardListItem linkTo="/admin/movies">
                    <Film /> Quản lý phim
                  </DashboardListItem>
                  <DashboardListItem linkTo="/admin/cinemas">
                    <BorderAll /> Quản lý rạp chiếu
                  </DashboardListItem>
                  <DashboardListItem linkTo="/admin/seattypes">
                    <TagFill /> Quản lý loại ghế
                  </DashboardListItem>
                  <DashboardListItem linkTo="/admin/screenings/edit">
                    <ProjectorFill /> Quản lý lịch chiếu
                  </DashboardListItem>
                  <DashboardListItem linkTo="/admin/staff">
                    <PeopleFill /> Quản lý nhân viên
                  </DashboardListItem>
                </>
              )}

              {(user.role === ROLES.ADMIN || user.role === ROLES.STAFF) && (
                <>
                  <DashboardListItem linkTo="/tickets/validation">
                    <QrCodeScan /> Quét vé
                  </DashboardListItem>
                  <DashboardListItem linkTo="/admin/statistics">
                    <BarChartFill /> Thống kê
                  </DashboardListItem>
                </>
              )}

              <DashboardListItem linkTo="/user/tickets">
                <TicketFill /> Vé của tôi
              </DashboardListItem>
              <DashboardListItem linkTo="/user/account">
                <PersonVcardFill /> Chỉnh sửa tài khoản
              </DashboardListItem>
            </div>
          </>
        )}
      </Content>
    </Container>
  );
};

export default Dashboard;
