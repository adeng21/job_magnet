type Company = {
  name: string;
};
type Job = {
  Company: Company;
  url: string;
  title: string;
  location: string;
};

interface JobsProps {
  jobs: Job[];
}
const JobsTable = ({ jobs }: JobsProps) => {
  return (
    <div>
      <h3>Current Jobs</h3>
      <table>
        <tr>
          <th>Company</th>
          <th>Role</th>
          <th>Location</th>
          <th>Link</th>
        </tr>
        {jobs.map((job, idx) => (
          <tr key={idx}>
            <td>{job.Company.name}</td>
            <td>{job.title}</td>
            <td>{job.location}</td>
            <td>{job.url}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};
export default JobsTable;
