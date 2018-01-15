import React from 'react';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';

const styles = theme => ({
  card: {
    minWidth: 290,
    height: 100,
  },
  media: {
    height: 30,
  },
  title: {
    marginBottom: 16,
    fontSize: 16,
    color: theme.palette.text.secondary,
    position: 'absolute',
    right: 10,
    top: 10
  },
  pos: {
    marginBottom: 5,
    color: theme.palette.text.secondary,
    position: 'absolute',
    right: 10,
    top: 60,
    fontSize: 18,

  },
});
function CountHeader(props) {
  const { classes } = props;
  return (
    <div>
      <div style={{ position: 'absolute', top: 100, right: 50, zIndex: 1000 }}>
        <Card className={classes.card}>
        <CardContent>
            <Typography className={classes.title}>CHAINCODE</Typography>
            <Typography className={classes.pos}>{11} </Typography>
          </CardContent>
          <CardActions>
            <Button dense color="primary">
              More
          </Button>
          </CardActions>
        </Card>
      </div>
      <div style={{ position: 'absolute', top: 100, right: 350, zIndex: 1000 }}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title}>TX</Typography>
            <Typography className={classes.pos}>{5} </Typography>
          </CardContent>
        </Card>
      </div>
      <div style={{ position: 'absolute', top: 100, right: 650, zIndex: 1000 }}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title}>BLOCK</Typography>
            <Typography className={classes.pos}>{5} </Typography>
          </CardContent>
        </Card>
      </div>
      <div style={{ position: 'absolute', top: 100, right: 950, zIndex: 1000 }}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title}>PEER</Typography>
            <Typography className={classes.pos}>{1} </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

CountHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CountHeader);

