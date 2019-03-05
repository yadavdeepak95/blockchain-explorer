/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';

import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { shape, string } from 'prop-types';

import { authSelectors, authOperations } from '../../state/redux/auth';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  container: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  title: {
    marginTop: theme.spacing.unit * 2
  },
  actions: {
    marginTop: theme.spacing.unit * 3
  }
});

export class Enroll extends Component {
  static propTypes = {
    classes: shape({
      form: string,
      container: string,
      paper: string,
      actions: string
    }).isRequired
  };

  constructor(props) {
    super(props);
    const { enrolled } = props;
    this.state = {
      enrollmentID: {
        error: null,
        value: ''
      },
      enrollmentSecret: {
        error: null,
        value: ''
      },
      csr: {
        error: null,
        value: ''
      },
      profile: {
        error: null,
        value: ''
      },
      attr_reqs: {
        error: null,
        value: ''
      },
      error: '',
      enrolled,
      isLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { enrolled = [], error } = nextProps;
    this.setState(() => ({
      enrolled,
      error
    }));
  }

  handleChange = event => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [name]: { value }
    });
  };

  submitForm = async e => {
    e.preventDefault();

    const { enroll, onEnroll } = this.props;
    const {
      enrollmentID,
      enrollmentSecret,
      csr,
      profile,
      attr_reqs
    } = this.state;

    const user = {
      enrollmentID: enrollmentID.value,
      enrollmentSecret: enrollmentSecret.value,
      csr: csr.value,
      profile: profile.value,
      attr_reqs: attr_reqs.value
    };

    await enroll(user);

    onEnroll(user);

    return true;
  };

  render() {
    const {
      enrollmentID,
      enrollmentSecret,
      csr,
      profile,
      attr_reqs,
      isLoading
    } = this.state;
    const { classes, error, onClose } = this.props;
    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <Typography
            className={classes.title}
            component="h5"
            variant="headline"
          >
            Enroll User
          </Typography>
          <form className={classes.form} onSubmit={this.submitForm}>
            <FormControl margin="normal" required fullWidth>
              <TextField
                required
                fullWidth
                id="enrollmentID"
                name="enrollmentID"
                label="Enrollment ID"
                disabled={isLoading}
                value={enrollmentID.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {enrollmentID.error && (
                <FormHelperText id="component-error-text" error>
                  {enrollmentID.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                required
                fullWidth
                error={!!enrollmentSecret.error}
                id="enrollmentSecret"
                type="enrollmentSecret"
                name="enrollmentSecret"
                label="Enrollment Secret"
                disabled={isLoading}
                value={enrollmentSecret.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {enrollmentSecret.error && (
                <FormHelperText id="component-error-text" error>
                  {enrollmentSecret.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                error={!!csr.error}
                required
                fullWidth
                id="csr"
                name="csr"
                label="CSR"
                disabled={isLoading}
                value={csr.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {csr.error && (
                <FormHelperText id="component-error-text" error>
                  {csr.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                required
                fullWidth
                error={!!profile.error}
                id="profile"
                type="profile"
                name="profile"
                label="Profile"
                disabled={isLoading}
                value={profile.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {profile.error && (
                <FormHelperText id="component-error-text" error>
                  {profile.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                required
                fullWidth
                error={!!attr_reqs.error}
                id="attr_reqs"
                type="attr_reqs"
                name="attr_reqs"
                label="Attr Reqs"
                disabled={isLoading}
                value={attr_reqs.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {attr_reqs.error && (
                <FormHelperText id="component-error-text" error>
                  {attr_reqs.error}
                </FormHelperText>
              )}
            </FormControl>
            {error && (
              <FormHelperText id="component-error-text" error>
                {error}
              </FormHelperText>
            )}
            <Grid
              container
              spacing={16}
              direction="row"
              justify="flex-end"
              className={classes.actions}
            >
              <Grid item>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Enroll
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </div>
    );
  }
}

const { errorSelector, enrolledSelector } = authSelectors;

export default compose(
  withStyles(styles),
  connect(
    state => ({
      enrolled: enrolledSelector(state),
      error: errorSelector(state)
    }),
    {
      enroll: authOperations.enroll
    }
  )
)(Enroll);
