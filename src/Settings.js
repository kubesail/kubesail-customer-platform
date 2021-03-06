import { Component } from "react";
import { fetch } from "./util";

class Settings extends Component {
  state = { platform: null, formFields: {} };

  constructor(props) {
    super(props);
    this.state.platform = props.platform;
  }

  updateSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const variableMetadata = this.state.platform.plans[0].variableMetadata;
    for (const pair of formData.entries()) {
      const variable = pair[0];
      const value = pair[1];
      const varData = variableMetadata[variable];
      if (varData.userRequired && !value) {
        this.setState({ requiredEntryError: variable });
        return;
      }
    }
    await fetch("/platform/customer/plan", {
      method: "POST",
      body: { variableData: Object.fromEntries(formData) },
    });
    setTimeout(() => {
      this.props.fetchProfile();
    }, 250);
  };

  render() {
    const variableMetadata = this.state.platform.plans[0].variableMetadata;
    const variableData = this.props.profile?.customer?.platformPlans?.[0]
      ?.platformCustomerPlan?.variableData;

    return (
      <div className="Settings">
        <form onSubmit={this.updateSettings}>
          <div>
            {(this.props.profile?.customer?.platformPlans || []).map((plan) => (
              <div key={plan.name}>
                <h2>Settings</h2>
              </div>
            ))}
          </div>
          {Object.keys(variableMetadata).map((variable) => {
            const field = variableMetadata[variable];
            const value = variableData?.[variable];
            return (
              <div className="input" key={variable}>
                {variable}
                <input
                  type="text"
                  id={variable}
                  name={variable}
                  placeholder={field.description || ""}
                  value={
                    this.state.formFields[variable] ||
                    value ||
                    field.default ||
                    ""
                  }
                  onChange={(e) =>
                    this.setState({
                      formFields: {
                        ...this.state.formFields,
                        [variable]: e.target.value,
                      },
                    })
                  }
                />
                {this.state.requiredEntryError === variable ? (
                  <div>This field is required!</div>
                ) : null}
                <label htmlFor="password" className="input-label">
                  {variable}
                </label>
              </div>
            );
          })}

          <button className="plain" type="submit">
            Save & Re-Launch
          </button>
        </form>
      </div>
    );
  }
}

export default Settings;
