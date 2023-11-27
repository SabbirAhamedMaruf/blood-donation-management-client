import { useContext, useEffect, useState } from "react";
import SingleDonationData from "../../../Components/SingleDonationData";
import { NotificationContext } from "../../../hooks/Notification";
import useAxiosPublic from "../../../API/useAxiosPublic";
import useMyDonationData from "../../../API/useMyDonationData";
import "../../../index.css"
import { SecurityContext } from "../../../Provider/SecurityProvider";

const DonorDonation = () => {
  const {user}=useContext(SecurityContext);
  const { handleSuccessToast, handleErrorToast } =
    useContext(NotificationContext);
  const [mydonationData, refetch] = useMyDonationData();
  const axiosPublic = useAxiosPublic();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);

  // pagination concept
  const [paginationDataHolder, setPaginationDataHolder]=useState([])
  const [catagory,setCatagory]=useState("pending");
  const [currentPage,setCurrentPage]=useState(0);
  let itemsperpage = 3;
  const numebrOfPages = Math.ceil(mydonationData.length / itemsperpage);
  const pages = [...Array(numebrOfPages).keys()];
  // fetching data using pagination
  useEffect(()=>{
    axiosPublic.get(`/fetchdatabypagination?email=${user.email}&currentpage=${currentPage}&catagory=${catagory}`)
    .then(res=> setPaginationDataHolder(res.data.data))
  },[axiosPublic,currentPage,user.email,catagory])

  const handleChangeCatagory=(e)=>{
    e.preventDefault();
    setCatagory(e.target.value);
  }

  
  // deleteing donation request
  const handleDeleteDonationData = (donationId) => {
    axiosPublic
      .delete(`/deletedonationrequestsdata?donationId=${donationId}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.data.acknowledged) {
          handleSuccessToast("Donation request deleted successfully!");
          setShowDeleteModal(false);
          refetch();
        } else {
          handleErrorToast(
            "An error occured during deletion donation request!"
          );
        }
      });
  };

  // update donation status
  const handleUpdateDonationStatus = (donationId, status) => {
    console.log(donationId, status);
    axiosPublic
      .patch(`/confrimdonation?donationId=${donationId}&status=${status}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.data.acknowledged) {
          handleSuccessToast("Donation request deleted successfully!");
          setShowDeleteModal(false);
          refetch();
        } else {
          handleErrorToast(
            "An error occured during deletion donation request!"
          );
        }
      });
  };

  return (
    <div>
      <div className="w-[90%] h-[100vh] lg:h-[80vh] lg:w-[90vw] m-auto shadow-lg  md:p-5 lg:p-10 rounded-lg lg:rounded-2xl my-5">
        <div>
          <h1 className="h-1/4 text-center text-xl md:text-2xl lg:text-4xl font-semibold my-10">
            Your donation list
          </h1>
          {mydonationData.length === 0 ? (
            <h1 className="text-xl md:text-2xl lg:text-3xl text-red-500 font-semibold text-center mt-60">
              Not donation request found
            </h1>
          ) : (
            <div className="h-3/4 w-full py-5">
              <form>
                <div className="">
                  <label
                    className="ml-2 md:col-span-2 text-[15px] lg:text-xl font-semibold"
                    htmlFor="bloodgroup"
                  >
                    Sort By
                  </label>
                  <select
                    onChange={handleChangeCatagory}
                    className="ml-5 text-[12px] md:text-[15px] px-2 py-1 md:py-2 bg-red-50 outline-none"
                    name="bloodgroup"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="inprogress">Inprogress</option>
                    <option value="done">Done</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
              </form>
              <div className="overflow-x-auto ">
                <table className="table table-lg space-y-5">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Recipient Name</th>
                      <th>Recipient Location</th>
                      <th>Donation Date</th>
                      <th>Donation Time</th>
                      <th>Status</th>
                      <th>Donor Information</th>
                      <th>Edit</th>
                      <th>Delete</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginationDataHolder.map((i, idx) => (
                      <SingleDonationData
                        key={i._id}
                        number={idx}
                        data={i}
                        refetch={refetch}
                        handleDeleteDonationData={handleDeleteDonationData}
                        setShowDeleteModal={setShowDeleteModal}
                        showDeleteModal={showDeleteModal}
                        showChangeStatusModal={showChangeStatusModal}
                        setShowChangeStatusModal={setShowChangeStatusModal}
                        handleUpdateDonationStatus={handleUpdateDonationStatus}
                      ></SingleDonationData>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>No.</th>
                      <th>Recipient Name</th>
                      <th>Recipient Location</th>
                      <th>Donation Date</th>
                      <th>Donation Time</th>
                      <th>Status</th>
                      <th>Donor Information</th>
                      <th>Edit</th>
                      <th>Delete</th>
                      <th>View</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {/* pagination */}
              <div className="pagination mt-10 ml-5">
                <span className="text-xl font-semibold">Pages: </span>
                {pages.map((i, idx) => (
                  <button
                    onClick={()=>setCurrentPage(i)}
                    className={currentPage === i && 'selected'}
                    // className="mr-5 px-3 py-1  text-white rounded-md"
                    key={idx}
                  >
                    {i}
                  </button>
                ))}
              </div>
            
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDonation;
